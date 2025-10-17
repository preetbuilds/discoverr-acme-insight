import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockMetricData, mockPrompts } from '@/data/seedData';
import { Badge } from '@/components/ui/badge';
import { PromptDetailDrawer } from '@/components/PromptDetailDrawer';
import { Prompt } from '@/types';

export default function Visibility() {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  
  const components = [
    { name: 'LLM Presence', value: 85, weight: '50%' },
    { name: 'Authority Reach', value: 78, weight: '20%' },
    { name: 'Prompt Coverage', value: 92, weight: '20%' },
    { name: 'Freshness', value: 65, weight: '10%' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Visibility Score</h1>
        <p className="text-muted-foreground">
          Comprehensive metric measuring brand discoverability across AI platforms
        </p>
      </div>

      {/* Main Score */}
      <Card className="p-8">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-6xl font-bold text-primary">{mockMetricData.visibilityScore}</div>
            <div className="text-muted-foreground mt-2">out of 100</div>
          </div>
          <div className="text-right">
            <Badge variant="default" className="text-lg px-4 py-2">
              +{mockMetricData.visibilityDelta} vs last period
            </Badge>
          </div>
        </div>
      </Card>

      {/* Component Breakdown */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Score Components</h2>
        <div className="grid gap-4">
          {components.map((component) => (
            <Card key={component.name} className="p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold">{component.name}</h3>
                  <Badge variant="outline">{component.weight}</Badge>
                </div>
                <span className="text-2xl font-bold">{component.value}</span>
              </div>
              <Progress value={component.value} className="h-2" />
            </Card>
          ))}
        </div>
      </div>

      {/* Top Contributing Prompts */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Top Contributing Prompts</h2>
        <div className="space-y-3">
          {mockPrompts
            .sort((a, b) => b.promptVisibilityScore - a.promptVisibilityScore)
            .slice(0, 5)
            .map((prompt) => (
              <Card 
                key={prompt.id} 
                className="p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPrompt(prompt)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{prompt.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">Rank #{prompt.visibilityRank}</Badge>
                      <Badge variant="secondary">{prompt.air}% AIR</Badge>
                      <Badge variant="outline">{prompt.llmCoverage.length}/4 LLMs</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-primary">
                      {prompt.promptVisibilityScore}
                    </div>
                    <div className="text-xs text-muted-foreground">Visibility Score</div>
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
            <strong>Visibility Score:</strong> Normalized score (0-100) measuring brand discoverability. Formula: 0.5×PromptVisibility + 0.2×AuthorityReach + 0.2×Coverage + 0.1×Freshness
          </div>
          <div>
            <strong>LLM Presence (50% weight):</strong> How often your brand appears across different LLM engines, weighted by engine importance.
          </div>
          <div>
            <strong>Authority Reach (20% weight):</strong> Citations from high-authority domains (DA ≥ 80). More citations from authoritative sources = higher score.
          </div>
          <div>
            <strong>Prompt Coverage (20% weight):</strong> Percentage of tracked prompts where your brand appears at least once.
          </div>
          <div>
            <strong>Freshness (10% weight):</strong> How recent the citing pages are. Newer citations score higher.
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
