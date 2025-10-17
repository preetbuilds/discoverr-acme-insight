import { Prompt } from '@/types';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, ExternalLink } from 'lucide-react';
import { getSentimentColor } from '@/lib/metrics';

interface PromptDetailDrawerProps {
  prompt: Prompt | null;
  open: boolean;
  onClose: () => void;
}

export function PromptDetailDrawer({ prompt, open, onClose }: PromptDetailDrawerProps) {
  if (!prompt) return null;

  const exportEvidence = () => {
    const csv = [
      ['Engine', 'Rank', 'Sentiment', 'Snippet', 'Domains'],
      ...prompt.answers.map(a => [
        a.engine,
        a.rank.toString(),
        a.sentiment.toString(),
        a.snippet,
        a.citingDomains.map(d => d.domain).join('; ')
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prompt-${prompt.id}-evidence.csv`;
    a.click();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{prompt.text}</SheetTitle>
          <SheetDescription>
            Detailed analysis across {prompt.llmCoverage.length} LLM engines
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Top Metrics */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Visibility Rank</div>
              <div className="text-2xl font-bold">#{prompt.visibilityRank}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">AIR</div>
              <div className="text-2xl font-bold">{prompt.air}%</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Citations</div>
              <div className="text-2xl font-bold">{prompt.citationCount}</div>
            </div>
            <div className="rounded-lg border p-4">
              <div className="text-sm text-muted-foreground">Sentiment</div>
              <div className={`text-2xl font-bold ${getSentimentColor(prompt.sentiment)}`}>
                {prompt.sentiment.toFixed(2)}
              </div>
            </div>
          </div>

          {/* Engine Breakdown */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Engine Analysis</h3>
            <Accordion type="single" collapsible className="w-full">
              {prompt.answers.map((answer, idx) => (
                <AccordionItem key={idx} value={`engine-${idx}`}>
                  <AccordionTrigger>
                    <div className="flex items-center gap-3">
                      <span>{answer.engine}</span>
                      <Badge variant={answer.rank === 1 ? 'default' : 'secondary'}>
                        Rank #{answer.rank}
                      </Badge>
                      <Badge variant="outline" className={getSentimentColor(answer.sentiment)}>
                        {answer.sentiment.toFixed(2)}
                      </Badge>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 pt-2">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Snippet</h4>
                        <p className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: answer.highlighted }} />
                      </div>

                      <div>
                        <h4 className="text-sm font-medium mb-2">Citing Domains</h4>
                        <div className="space-y-2">
                          {answer.citingDomains.map((domain, i) => (
                            <div key={i} className="flex items-center justify-between p-2 rounded border">
                              <div className="flex items-center gap-2">
                                <a
                                  href={domain.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-sm font-medium text-primary hover:underline flex items-center gap-1"
                                >
                                  {domain.domain}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                                <Badge variant="outline" className="text-xs">
                                  DA: {domain.domainAuthority}
                                </Badge>
                                <Badge variant="secondary" className="text-xs">
                                  {domain.type}
                                </Badge>
                              </div>
                              <span className="text-xs text-muted-foreground">
                                {domain.freshness}d ago
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Export Button */}
          <Button onClick={exportEvidence} className="w-full">
            <Download className="h-4 w-4 mr-2" />
            Export Evidence (CSV)
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
