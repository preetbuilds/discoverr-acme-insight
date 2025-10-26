import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { getSentimentColor, getSentimentLabel } from '@/lib/metrics';
import { ThumbsUp, ThumbsDown, Minus, Info, Loader2 } from 'lucide-react';
import { PromptDetailDrawer } from '@/components/PromptDetailDrawer';
import { Prompt } from '@/types';
import { usePrompts } from '@/hooks/usePrompts';
import { useMetrics } from '@/hooks/useMetrics';

export default function Sentiment() {
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

  const sortedBySentiment = [...(prompts || [])].sort((a, b) => b.sentiment - a.sentiment);
  
  const llmSentimentScores = (prompts || []).reduce((acc, prompt) => {
    prompt.answers.forEach(answer => {
      if (!acc[answer.engine]) acc[answer.engine] = [];
      acc[answer.engine].push(answer.sentiment);
    });
    return acc;
  }, {} as Record<string, number[]>);
  
  const avgSentimentByLLM = Object.entries(llmSentimentScores).map(([engine, scores]) => ({
    engine,
    avgSentiment: scores.reduce((a, b) => a + b, 0) / scores.length
  })).sort((a, b) => b.avgSentiment - a.avgSentiment);
  
  const mostPositiveLLM = avgSentimentByLLM[0] || { engine: 'N/A', avgSentiment: 0 };

  const sentimentMix = {
    positive: Math.round((prompts || []).filter(p => p.sentiment >= 0.5).length / (prompts || []).length * 100) || 0,
    neutral: Math.round((prompts || []).filter(p => p.sentiment >= 0 && p.sentiment < 0.5).length / (prompts || []).length * 100) || 0,
    negative: Math.round((prompts || []).filter(p => p.sentiment < 0).length / (prompts || []).length * 100) || 0,
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Overall Sentiment</h1>
        <p className="text-muted-foreground">
          Sentiment analysis of brand mentions across LLM platforms
        </p>
      </div>

      <Card className="p-6 bg-success/5 border-success">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center">
            <Info className="h-6 w-6 text-success" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Most Positive LLM</h3>
            <p className="text-muted-foreground">
              <strong className="text-success">{mostPositiveLLM.engine}</strong> shows the most positive sentiment 
              with an average score of {mostPositiveLLM.avgSentiment.toFixed(2)} across all mentions.
            </p>
          </div>
        </div>
      </Card>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {(metrics?.sentimentScore || 0).toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Average Score</div>
            <Badge variant="default" className="mt-3">
              +{((metrics?.sentimentDelta || 0) * 100).toFixed(0)}% vs last period
            </Badge>
          </div>
        </Card>

        <Card className="p-6 border-success">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
              <ThumbsUp className="h-5 w-5 text-success" />
            </div>
            <div className="text-2xl font-bold">{sentimentMix.positive}%</div>
          </div>
          <div className="text-sm text-muted-foreground">Positive Mentions</div>
        </Card>

        <Card className="p-6 border-warning">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
              <Minus className="h-5 w-5 text-warning" />
            </div>
            <div className="text-2xl font-bold">{sentimentMix.neutral}%</div>
          </div>
          <div className="text-sm text-muted-foreground">Neutral Mentions</div>
        </Card>

        <Card className="p-6 border-destructive">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <ThumbsDown className="h-5 w-5 text-destructive" />
            </div>
            <div className="text-2xl font-bold">{sentimentMix.negative}%</div>
          </div>
          <div className="text-sm text-muted-foreground">Negative Mentions</div>
        </Card>
      </div>

      {/* Sentiment Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sentiment Distribution</h3>
        <div className="h-6 flex rounded-lg overflow-hidden">
          <div
            className="bg-success flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${sentimentMix.positive}%` }}
          >
            {sentimentMix.positive}%
          </div>
          <div
            className="bg-warning flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${sentimentMix.neutral}%` }}
          >
            {sentimentMix.neutral}%
          </div>
          <div
            className="bg-destructive flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${sentimentMix.negative}%` }}
          >
            {sentimentMix.negative}%
          </div>
        </div>
      </Card>

      {/* Prompts Ranked by Sentiment */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Prompts by Sentiment</h2>
        <div className="space-y-3">
          {sortedBySentiment.map((prompt) => (
            <Card
              key={prompt.id}
              className="p-5 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => setSelectedPrompt(prompt)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium mb-2">{prompt.text}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">Rank #{prompt.visibilityRank}</Badge>
                    <Badge variant="secondary">{prompt.citationCount} citations</Badge>
                    <Badge variant="outline">{prompt.air}% AIR</Badge>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-3xl font-bold ${getSentimentColor(prompt.sentiment)}`}>
                    {prompt.sentiment.toFixed(2)}
                  </div>
                  <Badge
                    variant={
                      prompt.sentimentType === 'positive' ? 'default' :
                      prompt.sentimentType === 'neutral' ? 'secondary' : 'destructive'
                    }
                    className="mt-2"
                  >
                    {getSentimentLabel(prompt.sentiment)}
                  </Badge>
                </div>
              </div>

              {/* Sample snippet from first answer */}
              {prompt.answers.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-1">
                    Sample ({prompt.answers[0].engine}):
                  </div>
                  <p className="text-sm italic">&ldquo;{prompt.answers[0].snippet.substring(0, 150)}...&rdquo;</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-6 bg-muted/30">
        <h3 className="text-lg font-semibold mb-4">Metric Definitions</h3>
        <div className="space-y-3 text-sm">
          <div>
            <strong>Sentiment Score:</strong> Numerical value from -1 (very negative) to +1 (very positive) measuring the tone of brand mentions. Formula: Average of all snippet sentiment scores.
          </div>
          <div>
            <strong>Sentiment Mix:</strong> Distribution of mentions categorized as Positive (≥0.5), Neutral (0 to 0.5), or Negative (&lt;0).
          </div>
          <div>
            <strong>Per-Engine Sentiment:</strong> Each LLM may have different sentiment patterns based on their training data and sources.
          </div>
        </div>
      </Card>

      <PromptDetailDrawer
        prompt={selectedPrompt}
        open={!!selectedPrompt}
        onClose={() => setSelectedPrompt(null)}
      />
    </div>
  );
}
