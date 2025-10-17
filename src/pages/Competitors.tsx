import { Card } from '@/components/ui/card';
import { mockCompetitors } from '@/data/seedData';
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
import { TrendingUp, TrendingDown } from 'lucide-react';

export default function Competitors() {
  const ourSOV = 11; // AcmeCRM SOV
  const totalSOV = ourSOV + mockCompetitors.reduce((acc, c) => acc + c.sov, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Competitor Analysis</h1>
        <p className="text-muted-foreground">
          Share of voice and competitive positioning in LLM responses
        </p>
      </div>

      {/* SOV Overview */}
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
            <span className="text-sm">Need to close gap</span>
          </div>
        </Card>
      </div>

      {/* SOV Breakdown */}
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

      {/* Detailed Comparison */}
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
                <TableRow key={competitor.name} className="hover:bg-muted/50 cursor-pointer">
                  <TableCell className="font-medium">{competitor.name}</TableCell>
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
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    </div>
  );
}
