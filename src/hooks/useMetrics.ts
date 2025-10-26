import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export function useMetrics() {
  return useQuery({
    queryKey: ['metrics'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('metrics')
        .select('*')
        .order('calculated_at', { ascending: false })
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        return {
          visibilityScore: 0,
          visibilityDelta: 0,
          overallRanking: 0,
          rankingDelta: 0,
          topAnswerRate: 0,
          topAnswerRateDelta: 0,
          sentimentScore: 0,
          sentimentDelta: 0,
          topicSourcesCount: 0,
          sparklineData: [0, 0, 0, 0, 0, 0, 0, 0]
        };
      }

      const metadata = data.metadata as any;

      return {
        visibilityScore: Number(data.value) || 0,
        visibilityDelta: Number(data.delta) || 0,
        overallRanking: metadata?.overallRanking || 0,
        rankingDelta: metadata?.rankingDelta || 0,
        topAnswerRate: metadata?.topAnswerRate || 0,
        topAnswerRateDelta: metadata?.topAnswerRateDelta || 0,
        sentimentScore: metadata?.sentimentScore || 0,
        sentimentDelta: metadata?.sentimentDelta || 0,
        topicSourcesCount: metadata?.topicSourcesCount || 0,
        sparklineData: metadata?.sparklineData || [0, 0, 0, 0, 0, 0, 0, 0]
      };
    },
  });
}
