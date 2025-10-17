import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { mockMetricData, mockPrompts } from '@/data/seedData';
import { Badge } from '@/components/ui/badge';

export default function Visibility() {
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
              <Card key={prompt.id} className="p-4 hover:shadow-md transition-shadow cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <p className="font-medium">{prompt.text}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="outline">Rank #{prompt.visibilityRank}</Badge>
                      <Badge variant="secondary">{prompt.air}% AIR</Badge>
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
    </div>
  );
}
