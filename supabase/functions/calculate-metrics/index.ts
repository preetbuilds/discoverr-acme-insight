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
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { userId, brandName } = await req.json();
    
    console.log(`Calculating metrics for user ${userId}, brand: ${brandName}`);

    // Fetch all prompts and answers for this user
    const { data: prompts, error: promptsError } = await supabase
      .from('prompts')
      .select(`
        *,
        prompt_answers (
          *,
          citing_domains (*)
        )
      `)
      .eq('user_id', userId)
      .eq('processed', true);

    if (promptsError) {
      throw new Error(`Error fetching prompts: ${promptsError.message}`);
    }

    console.log(`Found ${prompts.length} processed prompts`);

    // Calculate AIR (AI Engine Representation)
    // AIR = (Number of engines mentioning brand / Total engines tested) * 100
    const totalPrompts = prompts.length;
    const promptsWithChatGPT = prompts.filter((p: any) => 
      p.prompt_answers?.some((a: any) => a.engine === 'ChatGPT' && a.rank > 0)
    ).length;
    
    const air = totalPrompts > 0 ? (promptsWithChatGPT / totalPrompts) * 100 : 0;

    // Calculate Visibility Score
    // Based on weighted presence across engines and average rank
    let totalWeightedPresence = 0;
    let totalRankScore = 0;
    let validAnswers = 0;

    for (const prompt of prompts as any[]) {
      for (const answer of prompt.prompt_answers || []) {
        if (answer.rank > 0) {
          // Engine weights: ChatGPT: 0.4, Gemini: 0.3, Perplexity: 0.2, Claude: 0.1
          const engineWeight = answer.engine === 'ChatGPT' ? 0.4 : 0.1;
          totalWeightedPresence += engineWeight;
          
          // Normalize rank (1-10 scale, lower is better)
          const normalizedRank = 1 - ((answer.rank - 1) / 9);
          totalRankScore += normalizedRank;
          validAnswers++;
        }
      }
    }

    const avgWeightedPresence = validAnswers > 0 ? totalWeightedPresence / validAnswers : 0;
    const avgRankScore = validAnswers > 0 ? totalRankScore / validAnswers : 0;
    const visibilityScore = Math.round((avgWeightedPresence * avgRankScore) * 100);

    // Calculate Overall Ranking
    // Average rank position across all answers
    const rankedAnswers = prompts.flatMap((p: any) => 
      (p.prompt_answers || []).filter((a: any) => a.rank > 0)
    );
    const avgRanking = rankedAnswers.length > 0
      ? rankedAnswers.reduce((sum: number, a: any) => sum + a.rank, 0) / rankedAnswers.length
      : 0;

    // Calculate Top Answer Rate
    // Percentage of prompts where brand appears in top 3
    const topAnswers = prompts.filter((p: any) =>
      p.prompt_answers?.some((a: any) => a.rank > 0 && a.rank <= 3)
    ).length;
    const topAnswerRate = totalPrompts > 0 ? (topAnswers / totalPrompts) * 100 : 0;

    // Calculate Sentiment Score
    const answersWithSentiment = prompts.flatMap((p: any) =>
      (p.prompt_answers || []).filter((a: any) => a.rank > 0)
    );
    const avgSentiment = answersWithSentiment.length > 0
      ? answersWithSentiment.reduce((sum: number, a: any) => sum + (a.sentiment || 0), 0) / answersWithSentiment.length
      : 0;
    const sentimentScore = Math.round((avgSentiment + 1) * 50); // Convert -1 to 1 scale to 0-100

    // Calculate sentiment mix
    const positiveSentiments = answersWithSentiment.filter((a: any) => a.sentiment >= 0.3).length;
    const neutralSentiments = answersWithSentiment.filter((a: any) => a.sentiment > -0.3 && a.sentiment < 0.3).length;
    const negativeSentiments = answersWithSentiment.filter((a: any) => a.sentiment <= -0.3).length;
    
    const sentimentMix = {
      positive: answersWithSentiment.length > 0 ? Math.round((positiveSentiments / answersWithSentiment.length) * 100) : 0,
      neutral: answersWithSentiment.length > 0 ? Math.round((neutralSentiments / answersWithSentiment.length) * 100) : 0,
      negative: answersWithSentiment.length > 0 ? Math.round((negativeSentiments / answersWithSentiment.length) * 100) : 0,
    };

    // Calculate citation count
    const allCitations = prompts.flatMap((p: any) =>
      (p.prompt_answers || []).flatMap((a: any) => a.citing_domains || [])
    );
    const citationCount = allCitations.length;

    // Domain authority metrics
    const avgDomainAuthority = allCitations.length > 0
      ? allCitations.reduce((sum: number, c: any) => sum + (c.domain_authority || 0), 0) / allCitations.length
      : 0;

    // Freshness score
    const avgFreshness = allCitations.length > 0
      ? allCitations.reduce((sum: number, c: any) => sum + (c.freshness || 0), 0) / allCitations.length
      : 0;
    const freshnessScore = Math.max(0, 100 - (avgFreshness * 3.33)); // 0-30 days -> 100-0 score

    // Authority Reach
    const highAuthCitations = allCitations.filter((c: any) => c.domain_authority >= 80).length;
    const authorityReach = Math.min(100, highAuthCitations * 5);

    // Prompt Coverage
    const promptsWithCoverage = prompts.filter((p: any) =>
      p.prompt_answers?.some((a: any) => a.rank > 0)
    ).length;
    const promptCoverage = totalPrompts > 0 ? (promptsWithCoverage / totalPrompts) * 100 : 0;

    // Enhanced Visibility Score calculation
    const enhancedVisibilityScore = Math.round(
      0.5 * (avgWeightedPresence * avgRankScore * 100) +
      0.2 * authorityReach +
      0.2 * promptCoverage +
      0.1 * freshnessScore
    );

    // Store metrics in database
    const metricsToStore = [
      {
        user_id: userId,
        metric_type: 'air',
        value: air,
        delta: 0, // Would calculate from previous period
        metadata: { brand: brandName, totalPrompts, promptsWithChatGPT }
      },
      {
        user_id: userId,
        metric_type: 'visibility_score',
        value: enhancedVisibilityScore,
        delta: 0,
        metadata: { 
          brand: brandName, 
          authorityReach, 
          promptCoverage, 
          freshnessScore,
          avgWeightedPresence: avgWeightedPresence * 100,
          avgRankScore: avgRankScore * 100
        }
      },
      {
        user_id: userId,
        metric_type: 'overall_ranking',
        value: avgRanking,
        delta: 0,
        metadata: { brand: brandName, rankedAnswersCount: rankedAnswers.length }
      },
      {
        user_id: userId,
        metric_type: 'top_answer_rate',
        value: topAnswerRate,
        delta: 0,
        metadata: { brand: brandName, topAnswers, totalPrompts }
      },
      {
        user_id: userId,
        metric_type: 'sentiment_score',
        value: sentimentScore,
        delta: 0,
        metadata: { 
          brand: brandName, 
          avgSentiment,
          sentimentMix,
          answersAnalyzed: answersWithSentiment.length
        }
      },
      {
        user_id: userId,
        metric_type: 'citation_count',
        value: citationCount,
        delta: 0,
        metadata: { 
          brand: brandName,
          avgDomainAuthority,
          highAuthCitations,
          byType: {
            owned: allCitations.filter((c: any) => c.type === 'owned').length,
            earned: allCitations.filter((c: any) => c.type === 'earned').length,
            competitor: allCitations.filter((c: any) => c.type === 'competitor').length
          }
        }
      }
    ];

    for (const metric of metricsToStore) {
      const { error: metricError } = await supabase
        .from('metrics')
        .insert(metric);

      if (metricError) {
        console.error('Error storing metric:', metricError);
      }
    }

    console.log('Metrics calculated and stored successfully');

    return new Response(
      JSON.stringify({
        success: true,
        metrics: {
          air,
          visibilityScore: enhancedVisibilityScore,
          overallRanking: avgRanking,
          topAnswerRate,
          sentimentScore,
          sentimentMix,
          citationCount,
          avgDomainAuthority,
          authorityReach,
          promptCoverage,
          freshnessScore
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    );

  } catch (error) {
    console.error('Error in calculate-metrics:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
