import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Prompt } from '@/types';

export function usePrompts() {
  return useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      const { data: promptsData, error: promptsError } = await supabase
        .from('prompts')
        .select('*')
        .eq('processed', true)
        .order('created_at', { ascending: false });

      if (promptsError) throw promptsError;

      const prompts: Prompt[] = await Promise.all(
        promptsData.map(async (prompt) => {
          // Get answers for this prompt
          const { data: answers, error: answersError } = await supabase
            .from('prompt_answers')
            .select('*')
            .eq('prompt_id', prompt.id);

          if (answersError) throw answersError;

          // Get citations
          const citationsMap = new Map();
          for (const answer of answers || []) {
            const { data: citations } = await supabase
              .from('citing_domains')
              .select('*')
              .eq('answer_id', answer.id);
            citationsMap.set(answer.id, citations || []);
          }

          // Calculate metrics
          const llmCoverage = [...new Set(answers?.map(a => a.engine) || [])];
          const citationCount = answers?.reduce((sum, answer) => 
            sum + (citationsMap.get(answer.id)?.length || 0), 0) || 0;
          
          const avgRank = answers?.length 
            ? answers.reduce((sum, a) => sum + (a.rank || 0), 0) / answers.length 
            : 0;
          
          const avgSentiment = answers?.length
            ? answers.reduce((sum, a) => sum + (Number(a.sentiment) || 0), 0) / answers.length
            : 0;

          const air = answers?.length 
            ? (answers.filter(a => a.rank === 1).length / answers.length) * 100 
            : 0;

          const topCitingDomain = answers
            ?.flatMap(a => citationsMap.get(a.id) || [])
            .sort((a, b) => (b.domain_authority || 0) - (a.domain_authority || 0))[0]?.domain || 'N/A';

          const freshness = Math.min(
            ...answers?.flatMap(a => 
              (citationsMap.get(a.id) || []).map((c: any) => c.freshness || 999)
            ) || [999]
          );

          const sentimentType = avgSentiment > 0.3 ? 'positive' : avgSentiment < -0.3 ? 'negative' : 'neutral';

          return {
            id: prompt.id,
            text: prompt.text,
            visibilityRank: Math.round(avgRank) || 0,
            air: Math.round(air),
            citationCount,
            topCitingDomain,
            sentiment: avgSentiment,
            sentimentType,
            llmCoverage,
            freshness: freshness === 999 ? 0 : freshness,
            promptVisibilityScore: Math.round(100 - avgRank * 10),
            answers: answers?.map(answer => ({
              engine: answer.engine,
              snippet: answer.snippet,
              citingDomains: (citationsMap.get(answer.id) || []).map((c: any) => ({
                domain: c.domain,
                url: c.url,
                domainAuthority: c.domain_authority,
                type: c.type,
                freshness: c.freshness
              })),
              rank: answer.rank || 0,
              sentiment: Number(answer.sentiment) || 0,
              highlighted: answer.highlighted || answer.snippet
            })) || []
          } as Prompt;
        })
      );

      return prompts;
    },
  });
}
