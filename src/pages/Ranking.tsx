import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import { PromptDetailDrawer } from '@/components/PromptDetailDrawer';
import { Prompt } from '@/types';
import { usePrompts } from '@/hooks/usePrompts';
import { useMetrics } from '@/hooks/useMetrics';

export default function Ranking() {
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

  const sortedPrompts = [...(prompts || [])].sort((a, b) => a.visibilityRank - b.visibilityRank);
  const topOneCount = (prompts || []).filter(p => p.visibilityRank === 1).length;
  const topThreeCount = (prompts || []).filter(p => p.visibilityRank <= 3).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Overall Ranking</h1>
        <p className="text-muted-foreground">
          Your average ranking position across all tracked prompts
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <div>
              <div className="text-3xl font-bold">#{metrics?.overallRanking || 0}</div>
              <div className="text-sm text-muted-foreground">Average Rank</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
              <Medal className="h-6 w-6 text-accent" />
            </div>
            <div>
              <div className="text-3xl font-bold">{topOneCount}</div>
              <div className="text-sm text-muted-foreground">#1 Rankings</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center">
              <Award className="h-6 w-6 text-secondary" />
            </div>
            <div>
              <div className="text-3xl font-bold">{topThreeCount}</div>
              <div className="text-sm text-muted-foreground">Top 3 Rankings</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Ranked Prompts */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Prompts Leaderboard</h2>
        <div className="space-y-3">
          {sortedPrompts.map((prompt, index) => (
            <Card
              key={prompt.id}
              className={`p-5 hover:shadow-md transition-all cursor-pointer ${
                prompt.visibilityRank === 1 ? 'border-primary border-2' : ''
              }`}
              onClick={() => setSelectedPrompt(prompt)}
            >
              <div className="flex items-start gap-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                  prompt.visibilityRank === 1
                    ? 'bg-primary text-primary-foreground'
                    : prompt.visibilityRank <= 3
                    ? 'bg-accent text-accent-foreground'
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {prompt.visibilityRank}
                </div>

                <div className="flex-1">
                  <p className="font-medium mb-2">{prompt.text}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{prompt.air}% AIR</Badge>
                    <Badge variant="secondary">{prompt.citationCount} citations</Badge>
                    <div className="flex items-center gap-1">
                      {prompt.llmCoverage.map(engine => (
                        <Badge key={engine} variant="outline" className="text-xs">
                          {engine}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm text-muted-foreground">Top Domain</div>
                  <div className="font-medium">{prompt.topCitingDomain}</div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-6 bg-muted/30">
        <h3 className="text-lg font-semibold mb-4">Metric Definitions</h3>
        <div className="space-y-3 text-sm">
          <div>
            <strong>Overall Ranking:</strong> Average rank position across all tracked prompts, weighted by prompt importance and engine coverage.
          </div>
          <div>
            <strong>AIR (Answer Inclusion Rate):</strong> Percentage of LLM engines that include your brand in their response. Formula: (Engines Mentioning Brand / Total Engines) × 100
          </div>
          <div>
            <strong>Visibility Rank:</strong> Position of your brand in each prompt's answer (1 = mentioned first/most prominently).
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
