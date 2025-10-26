import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.76.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openaiKey = Deno.env.get('OPENAI_API_KEY');
    
    if (!openaiKey) {
      throw new Error('OPENAI_API_KEY not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { prompts, userId, brandName } = await req.json();
    
    console.log(`Processing ${prompts.length} prompts for brand: ${brandName}`);

    // Insert prompts into database
    const promptRecords = [];
    for (const promptText of prompts) {
      const { data: prompt, error } = await supabase
        .from('prompts')
        .insert({
          user_id: userId,
          text: promptText,
          category: 'coffee_specialty'
        })
        .select()
        .single();

      if (error) {
        console.error('Error inserting prompt:', error);
        continue;
      }
      
      promptRecords.push(prompt);
    }

    console.log(`Inserted ${promptRecords.length} prompts`);

    // Process each prompt through GPT
    let processedCount = 0;
    
    for (const prompt of promptRecords) {
      try {
        // Call GPT to generate answer
        const gptResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `You are a helpful assistant that answers questions about Indian coffee brands. When answering, mention specific brands and provide detailed information. Always include citations to sources where relevant. Structure your response with:
1. A main answer (2-3 sentences)
2. Key brands mentioned
3. Supporting details with sources/URLs if available`
              },
              {
                role: 'user',
                content: prompt.text
              }
            ],
            temperature: 0.7,
            max_tokens: 500
          }),
        });

        const gptData = await gptResponse.json();
        const answer = gptData.choices[0].message.content;

        console.log(`GPT response for prompt ${prompt.id}:`, answer.substring(0, 100));

        // Analyze sentiment using GPT
        const sentimentResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${openaiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              {
                role: 'system',
                content: `Analyze the sentiment of the following text about "${brandName}". Return a JSON object with:
{
  "sentiment": <number between -1 and 1, where -1 is very negative, 0 is neutral, 1 is very positive>,
  "mentions": [list of brand names mentioned],
  "rank": <number 1-10 indicating where ${brandName} appears in the answer, 0 if not mentioned>,
  "citations": [{"domain": "example.com", "url": "https://...", "type": "owned|earned|competitor"}]
}

For citations:
- "owned" = official brand website or channels
- "earned" = third-party reviews, news articles, blogs
- "competitor" = competitor brand websites

If ${brandName} is not mentioned, set sentiment to 0 and rank to 0.`
              },
              {
                role: 'user',
                content: answer
              }
            ],
            temperature: 0.3,
            response_format: { type: "json_object" }
          }),
        });

        const sentimentData = await sentimentResponse.json();
        const analysis = JSON.parse(sentimentData.choices[0].message.content);

        console.log(`Analysis for prompt ${prompt.id}:`, analysis);

        // Extract highlighted portion (first mention of brand)
        const highlighted = answer.includes(brandName) 
          ? answer.substring(
              Math.max(0, answer.indexOf(brandName) - 50),
              Math.min(answer.length, answer.indexOf(brandName) + 100)
            )
          : '';

        // Insert prompt answer
        const { data: promptAnswer, error: answerError } = await supabase
          .from('prompt_answers')
          .insert({
            prompt_id: prompt.id,
            engine: 'ChatGPT',
            snippet: answer,
            rank: analysis.rank || 0,
            sentiment: analysis.sentiment || 0,
            highlighted: highlighted
          })
          .select()
          .single();

        if (answerError) {
          console.error('Error inserting answer:', answerError);
          continue;
        }

        // Insert citing domains
        if (analysis.citations && analysis.citations.length > 0) {
          for (const citation of analysis.citations) {
            // Calculate domain authority (mock for now, would need actual API)
            const domainAuthority = Math.floor(Math.random() * 40) + 60; // 60-100
            const freshness = Math.floor(Math.random() * 30); // 0-30 days

            await supabase
              .from('citing_domains')
              .insert({
                answer_id: promptAnswer.id,
                domain: citation.domain,
                url: citation.url || `https://${citation.domain}`,
                domain_authority: domainAuthority,
                type: citation.type || 'earned',
                freshness: freshness
              });
          }
        }

        // Mark prompt as processed
        await supabase
          .from('prompts')
          .update({ processed: true })
          .eq('id', prompt.id);

        processedCount++;
        console.log(`Processed ${processedCount}/${promptRecords.length} prompts`);

      } catch (error) {
        console.error(`Error processing prompt ${prompt.id}:`, error);
      }
    }

    // Calculate metrics after processing all prompts
    console.log('Calculating metrics...');
    
    // Trigger metric calculation
    const metricsResponse = await fetch(
      `${supabaseUrl}/functions/v1/calculate-metrics`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, brandName })
      }
    );

    if (!metricsResponse.ok) {
      console.error('Failed to calculate metrics:', await metricsResponse.text());
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        processedCount,
        totalPrompts: promptRecords.length,
        message: `Processed ${processedCount} prompts for ${brandName}`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in process-prompts:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
