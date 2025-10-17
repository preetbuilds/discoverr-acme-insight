import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { mockCompetitors, mockPrompts } from '@/data/seedData';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { PromptDetailDrawer } from '@/components/PromptDetailDrawer';
import { Prompt } from '@/types';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';

export default function Competitors() {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [expandedCompetitor, setExpandedCompetitor] = useState<string | null>(null);
  
  const ourSOV = 11;
  const totalSOV = ourSOV + mockCompetitors.reduce((acc, c) => acc + c.sov, 0);
  
  const llmCompetitorMentions = mockPrompts.reduce((acc, prompt) => {
    prompt.llmCoverage.forEach(engine => {
      acc[engine] = (acc[engine] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  const topCompetitorLLM = Object.entries(llmCompetitorMentions).sort((a, b) => b[1] - a[1])[0];
  
  const laggingPrompts = mockPrompts.filter(p => p.visibilityRank > 3);
  const competitiveGapPrompts = mockPrompts.filter(p => p.visibilityRank > 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Competitor Analysis</h1>
        <p className="text-muted-foreground">
          Share of voice and competitive positioning in LLM responses
        </p>
      </div>

      <Card className="p-6 bg-accent/5 border-accent">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-accent" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Competitive Intelligence</h3>
            <p className="text-muted-foreground">
              <strong className="text-accent">{topCompetitorLLM[0]}</strong> shows the highest competitive activity 
              with mentions in {topCompetitorLLM[1]} prompts. Focus optimization efforts here.
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Our Share of Voice</h3>
          <div className="text-5xl font-bold text-primary mb-2">{ourSOV}%</div>
          <p className="text-sm text-muted-foreground mb-4">
            Across all tracked prompts
          </p>
          <Progress value={ourSOV} className="h-3" />
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Top Competitor Gap</h3>
          <div className="text-5xl font-bold text-destructive mb-2">
            -{mockCompetitors[0].sov - ourSOV}%
          </div>
          <p className="text-sm text-muted-foreground mb-2">
            Behind {mockCompetitors[0].name}
          </p>
          <div className="flex items-center gap-2">
            <TrendingDown className="h-4 w-4 text-destructive" />
            <span className="text-sm">Need to close gap in {laggingPrompts.length} prompts</span>
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Share of Voice Breakdown</h2>
        <Card className="p-6">
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-primary">AcmeCRM (You)</span>
                <span className="font-bold">{ourSOV}%</span>
              </div>
              <Progress value={(ourSOV / totalSOV) * 100} className="h-3" />
            </div>

            {mockCompetitors.map((competitor) => (
              <div key={competitor.name}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{competitor.name}</span>
                  <span className="font-bold">{competitor.sov}%</span>
                </div>
                <Progress value={(competitor.sov / totalSOV) * 100} className="h-2" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Competitive Gap Analysis</h2>
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-lg mb-2">Prompts Where We're Lagging</h3>
            <p className="text-sm text-muted-foreground">
              {laggingPrompts.length} prompts ranked below position #3 represent optimization opportunities
            </p>
          </div>
          <div className="space-y-2">
            {laggingPrompts.slice(0, 3).map((prompt) => (
              <div 
                key={prompt.id} 
                className="p-4 bg-muted/30 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                onClick={() => setSelectedPrompt(prompt)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="font-medium mb-2">{prompt.text}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="destructive">Rank #{prompt.visibilityRank}</Badge>
                      <Badge variant="outline">{prompt.air}% AIR</Badge>
                      <Badge variant="secondary">{prompt.citationCount} citations</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-muted-foreground mb-1">Gap to #1</div>
                    <div className="text-xl font-bold text-destructive">-{prompt.visibilityRank - 1}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-6">Detailed Comparison</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Competitor</TableHead>
                <TableHead className="text-center">SOV</TableHead>
                <TableHead className="text-center">Overlap Index</TableHead>
                <TableHead className="text-center">Avg Rank Gap</TableHead>
                <TableHead className="text-center">Citations</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockCompetitors.map((competitor) => (
                <Collapsible 
                  key={competitor.name}
                  open={expandedCompetitor === competitor.name}
                  onOpenChange={(isOpen) => setExpandedCompetitor(isOpen ? competitor.name : null)}
                  asChild
                >
                  <>
                    <TableRow className="hover:bg-muted/50 cursor-pointer">
                      <CollapsibleTrigger asChild>
                        <TableCell className="font-medium">
                          {competitor.name}
                          <div className="text-xs text-muted-foreground mt-1">
                            Click for topic breakdown
                          </div>
                        </TableCell>
                      </CollapsibleTrigger>
                      <TableCell className="text-center">
                        <Badge variant={competitor.sov > ourSOV ? 'destructive' : 'default'}>
                          {competitor.sov}%
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center">
                          <Progress
                            value={competitor.overlapIndex * 100}
                            className="w-20 h-2 mr-2"
                          />
                          <span className="text-sm">{(competitor.overlapIndex * 100).toFixed(0)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className={`flex items-center justify-center gap-1 ${
                          competitor.avgRankGap < 0 ? 'text-destructive' : 'text-success'
                        }`}>
                          {competitor.avgRankGap < 0 ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : (
                            <TrendingUp className="h-4 w-4" />
                          )}
                          <span className="font-semibold">
                            {Math.abs(competitor.avgRankGap).toFixed(1)}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-center font-semibold">
                        {competitor.citationCount}
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} className="p-0">
                        <CollapsibleContent>
                          <div className="p-4 bg-muted/30">
                            <h4 className="font-semibold mb-3">Topics Where {competitor.name} Leads</h4>
                            <div className="grid gap-2">
                              {competitiveGapPrompts.slice(0, 2).map((prompt) => (
                                <div 
                                  key={prompt.id}
                                  className="p-3 bg-background rounded hover:bg-muted/50 cursor-pointer transition-colors"
                                  onClick={() => setSelectedPrompt(prompt)}
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm">{prompt.text}</span>
                                    <Badge variant="outline" className="ml-2">#{prompt.visibilityRank}</Badge>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </CollapsibleContent>
                      </TableCell>
                    </TableRow>
                  </>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>

      <Card className="p-6 bg-muted/30">
        <h3 className="text-lg font-semibold mb-4">Metric Definitions</h3>
        <div className="space-y-3 text-sm">
          <div>
            <strong>Share of Voice (SOV):</strong> Percentage of total brand mentions across all tracked prompts. Formula: (Brand Citations / Total Citations) × 100
          </div>
          <div>
            <strong>Overlap Index:</strong> Percentage of prompts where both you and the competitor appear (0-100%). Higher overlap indicates direct competition.
          </div>
          <div>
            <strong>Avg Rank Gap:</strong> Average difference in ranking positions. Negative values mean the competitor ranks better on average.
          </div>
          <div>
            <strong>Citations:</strong> Total number of times the competitor is cited across all LLM responses in the dataset.
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
