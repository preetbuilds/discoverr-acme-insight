import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { mockTopicSources, mockPrompts } from '@/data/seedData';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ExternalLink, Info } from 'lucide-react';
import { PromptDetailDrawer } from '@/components/PromptDetailDrawer';
import { Prompt } from '@/types';

export default function Topics() {
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const totalShare = mockTopicSources.reduce((acc, s) => acc + s.sharePercent, 0);
  
  // Calculate which LLM mentions brand most
  const llmMentionCounts = mockPrompts.reduce((acc, prompt) => {
    prompt.llmCoverage.forEach(engine => {
      acc[engine] = (acc[engine] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);
  
  const topLLM = Object.entries(llmMentionCounts).sort((a, b) => b[1] - a[1])[0];
  
  // Get prompts for each source
  const getPromptsForDomain = (domain: string) => {
    return mockPrompts.filter(p => 
      p.answers.some(a => a.citingDomains.some(d => d.domain === domain))
    );
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Topic Traffic Sources</h1>
        <p className="text-muted-foreground">
          Web sources and domains that drive LLM citations for your brand
        </p>
      </div>

      {/* LLM Coverage Insight */}
      <Card className="p-6 bg-primary/5 border-primary">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Info className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold text-lg mb-1">Top LLM Coverage</h3>
            <p className="text-muted-foreground">
              <strong className="text-primary">{topLLM[0]}</strong> mentions your brand most frequently 
              across {topLLM[1]} out of {mockPrompts.length} tracked prompts ({Math.round(topLLM[1] / mockPrompts.length * 100)}%)
            </p>
          </div>
        </div>
      </Card>

      {/* Top 3 Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mockTopicSources.slice(0, 3).map((source, idx) => {
          const sourcePrompts = getPromptsForDomain(source.domain);
          return (
            <Card key={source.domain} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white font-bold ${
                    idx === 0 ? 'bg-primary' : idx === 1 ? 'bg-secondary' : 'bg-accent'
                  }`}>
                    {idx + 1}
                  </div>
                  <Badge variant="outline">
                    DA: {source.domainAuthority}
                  </Badge>
                </div>
                <Badge variant={source.type === 'owned' ? 'default' : source.type === 'earned' ? 'secondary' : 'outline'}>
                  {source.type}
                </Badge>
              </div>
              <div className="mb-2">
                <div className="font-semibold text-lg">{source.domain}</div>
              </div>
              <div className="text-3xl font-bold text-primary mb-1">
                {source.sharePercent}%
              </div>
              <div className="text-sm text-muted-foreground mb-3">of total citations</div>
              <div className="text-sm font-medium">
                <span className="text-primary">{sourcePrompts.length}</span> of {mockPrompts.length} prompts
              </div>
            </Card>
          );
        })}
      </div>

      {/* Full Domain List */}
      <div>
        <h2 className="text-2xl font-bold mb-6">All Traffic Sources</h2>
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Domain</TableHead>
                <TableHead className="text-center">Share %</TableHead>
                <TableHead className="text-center">DA</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Top Prompts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTopicSources.map((source) => {
                const sourcePrompts = getPromptsForDomain(source.domain);
                return (
                  <TableRow key={source.domain} className="hover:bg-muted/50">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <a
                          href={`https://${source.domain}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-primary hover:underline flex items-center gap-1"
                        >
                          {source.domain}
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <div className="font-semibold">{source.sharePercent}%</div>
                      <div className="text-xs text-muted-foreground">
                        {sourcePrompts.length}/{mockPrompts.length} prompts
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant="outline">{source.domainAuthority}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={source.type === 'owned' ? 'default' : source.type === 'earned' ? 'secondary' : 'outline'}>
                        {source.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {sourcePrompts.slice(0, 2).map((prompt) => (
                          <Badge 
                            key={prompt.id} 
                            variant="outline" 
                            className="text-xs cursor-pointer hover:bg-muted"
                            onClick={() => setSelectedPrompt(prompt)}
                          >
                            {prompt.text.length > 30 ? prompt.text.substring(0, 30) + '...' : prompt.text}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      </div>

      {/* Distribution Chart Placeholder */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Citation Distribution</h3>
        <div className="space-y-3">
          {mockTopicSources.map((source) => (
            <div key={source.domain}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{source.domain}</span>
                <span className="text-sm text-muted-foreground">{source.sharePercent}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-300"
                  style={{ width: `${source.sharePercent}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Metric Definitions */}
      <Card className="p-6 bg-muted/30">
        <h3 className="text-lg font-semibold mb-4">Metric Definitions</h3>
        <div className="space-y-3 text-sm">
          <div>
            <strong>Domain Authority (DA):</strong> A search engine ranking score (0-100) predicting how well a website will rank. Higher scores indicate more authoritative domains.
          </div>
          <div>
            <strong>Share %:</strong> Percentage of total brand citations coming from this domain across all LLM responses.
          </div>
          <div>
            <strong>Owned vs Earned:</strong>
            <ul className="list-disc list-inside ml-4 mt-1">
              <li><strong>Owned:</strong> Domains you control (your website, blog, documentation)</li>
              <li><strong>Earned:</strong> Third-party domains mentioning you organically (reviews, news, articles)</li>
              <li><strong>Competitor:</strong> Domains owned by competing brands</li>
            </ul>
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
