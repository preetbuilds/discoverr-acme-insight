import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MetricCard } from '@/components/MetricCard';
import { PromptsTable } from '@/components/PromptsTable';
import { PromptDetailDrawer } from '@/components/PromptDetailDrawer';
import { Prompt } from '@/types';
import { usePrompts } from '@/hooks/usePrompts';
import { useMetrics } from '@/hooks/useMetrics';
import { Loader2 } from 'lucide-react';

export default function Overview() {
  const navigate = useNavigate();
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const { data: prompts, isLoading: promptsLoading } = usePrompts();
  const { data: metrics, isLoading: metricsLoading } = useMetrics();

  if (promptsLoading || metricsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Overall Metrics */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Overall Metrics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          <MetricCard
            title="Visibility Score"
            value={metrics?.visibilityScore || 0}
            delta={metrics?.visibilityDelta || 0}
            sparklineData={metrics?.sparklineData || [0, 0, 0, 0, 0, 0, 0, 0]}
            description="How discoverable your brand is across LLM platforms"
            formula="0.5×PromptVis + 0.2×Authority + 0.2×Coverage + 0.1×Freshness"
            onClick={() => navigate('/visibility')}
          />
          <MetricCard
            title="Overall Ranking"
            value={`#${metrics?.overallRanking || 0}`}
            delta={metrics?.rankingDelta || 0}
            sparklineData={[4, 4, 3, 3, 2, 3, 3, 3]}
            description="Average ranking position across all tracked prompts"
            formula="Avg(rank_per_prompt) weighted by prompt importance"
            onClick={() => navigate('/ranking')}
          />
          <MetricCard
            title="Top Answer Rate"
            value={`${metrics?.topAnswerRate || 0}%`}
            delta={metrics?.topAnswerRateDelta || 0}
            sparklineData={[32, 34, 36, 35, 38, 37, 39, 40]}
            description="Percentage of prompts where you rank #1"
            formula="#1_ranks / total_prompts × 100"
            onClick={() => navigate('/ranking')}
          />
          <MetricCard
            title="Topic Sources"
            value={metrics?.topicSourcesCount || 0}
            delta={2}
            sparklineData={[8, 9, 10, 11, 12, 13, 14, 15]}
            description="Number of high-authority domains citing your brand"
            formula="Unique domains with DA >= 70"
            onClick={() => navigate('/topics')}
          />
          <MetricCard
            title="Sentiment Score"
            value={(metrics?.sentimentScore || 0).toFixed(2)}
            delta={Math.round((metrics?.sentimentDelta || 0) * 100)}
            sparklineData={[0.60, 0.62, 0.64, 0.65, 0.66, 0.67, 0.67, 0.68]}
            description="Overall sentiment of LLM mentions (-1 to 1)"
            formula="Avg(sentiment_per_mention) across all engines"
            onClick={() => navigate('/sentiment')}
          />
        </div>
      </div>

      {/* Prompts Table */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Prompts Performance</h2>
        <PromptsTable
          prompts={prompts || []}
          onPromptClick={setSelectedPrompt}
        />
      </div>

      {/* Prompt Detail Drawer */}
      <PromptDetailDrawer
        prompt={selectedPrompt}
        open={!!selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
      />
    </div>
  );
}
