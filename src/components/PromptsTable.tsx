import { useState } from 'react';
import { Prompt } from '@/types';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { getSentimentColor } from '@/lib/metrics';

interface PromptsTableProps {
  prompts: Prompt[];
  onPromptClick: (prompt: Prompt) => void;
}

export function PromptsTable({ prompts, onPromptClick }: PromptsTableProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredPrompts = prompts.filter(p =>
    p.text.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const engineIcons: Record<string, string> = {
    ChatGPT: '🤖',
    Gemini: '✨',
    Perplexity: '🔍',
    Claude: '🎯'
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[35%]">Prompt</TableHead>
              <TableHead className="text-center">Rank</TableHead>
              <TableHead className="text-center">AIR %</TableHead>
              <TableHead className="text-center">Citations</TableHead>
              <TableHead>Top Domain</TableHead>
              <TableHead className="text-center">Sentiment</TableHead>
              <TableHead className="text-center">Coverage</TableHead>
              <TableHead className="text-center">Freshness</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPrompts.map((prompt) => (
              <TableRow
                key={prompt.id}
                className="cursor-pointer hover:bg-muted/50"
                onClick={() => onPromptClick(prompt)}
              >
                <TableCell className="font-medium">{prompt.text}</TableCell>
                <TableCell className="text-center">
                  <Badge variant={prompt.visibilityRank <= 3 ? 'default' : 'secondary'}>
                    #{prompt.visibilityRank}
                  </Badge>
                </TableCell>
                <TableCell className="text-center font-semibold">{prompt.air}%</TableCell>
                <TableCell className="text-center">{prompt.citationCount}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="cursor-pointer hover:bg-muted">
                    {prompt.topCitingDomain}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-2">
                    <div className={`h-2 w-2 rounded-full ${
                      prompt.sentimentType === 'positive' ? 'bg-success' :
                      prompt.sentimentType === 'neutral' ? 'bg-warning' : 'bg-destructive'
                    }`} />
                    <span className={getSentimentColor(prompt.sentiment)}>
                      {prompt.sentiment.toFixed(2)}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    {prompt.llmCoverage.map(engine => (
                      <span key={engine} title={engine}>{engineIcons[engine]}</span>
                    ))}
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant={prompt.freshness <= 3 ? 'default' : 'secondary'}>
                    {prompt.freshness}d
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
