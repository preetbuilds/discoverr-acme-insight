import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Zap, RotateCcw, TrendingUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';

export default function DemoMode() {
  const [beforeMetrics] = useState({
    visibilityScore: 78,
    ranking: 3,
    air: 75,
    sentiment: 0.68,
  });

  const [afterMetrics] = useState({
    visibilityScore: 85,
    ranking: 2,
    air: 88,
    sentiment: 0.78,
  });

  const [isSimulated, setIsSimulated] = useState(false);

  const runSimulation = () => {
    setIsSimulated(true);
    toast.success('Simulation complete! Metrics updated with improved performance.');
  };

  const reset = () => {
    setIsSimulated(false);
    toast.info('Demo reset to baseline metrics.');
  };

  const currentMetrics = isSimulated ? afterMetrics : beforeMetrics;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Demo Mode</h1>
        <p className="text-muted-foreground">
          Simulate the impact of improved content strategy on your metrics
        </p>
      </div>

      {/* Demo Controls */}
      <Card className="p-6 bg-gradient-primary text-white">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold mb-2">Simulation Scenario</h3>
            <p className="opacity-90">
              Adding high-authority citations (Forbes, TechCrunch) + improving AIR by 13%
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={runSimulation}
              disabled={isSimulated}
              variant="secondary"
              size="lg"
            >
              <Zap className="h-4 w-4 mr-2" />
              Run Simulation
            </Button>
            {isSimulated && (
              <Button onClick={reset} variant="outline" size="lg">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reset
              </Button>
            )}
          </div>
        </div>
      </Card>

      {/* Metrics Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Before */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Badge variant="outline">Before</Badge>
            Current State
          </h2>
          <div className="space-y-4">
            <MetricComparisonCard
              title="Visibility Score"
              value={beforeMetrics.visibilityScore}
              isActive={!isSimulated}
            />
            <MetricComparisonCard
              title="Overall Ranking"
              value={`#${beforeMetrics.ranking}`}
              isActive={!isSimulated}
            />
            <MetricComparisonCard
              title="Answer Inclusion Rate"
              value={`${beforeMetrics.air}%`}
              isActive={!isSimulated}
            />
            <MetricComparisonCard
              title="Sentiment Score"
              value={beforeMetrics.sentiment.toFixed(2)}
              isActive={!isSimulated}
            />
          </div>
        </div>

        {/* After */}
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Badge variant="default">After Simulation</Badge>
            Projected Impact
          </h2>
          <div className="space-y-4">
            <MetricComparisonCard
              title="Visibility Score"
              value={afterMetrics.visibilityScore}
              delta={afterMetrics.visibilityScore - beforeMetrics.visibilityScore}
              isActive={isSimulated}
            />
            <MetricComparisonCard
              title="Overall Ranking"
              value={`#${afterMetrics.ranking}`}
              delta={-(afterMetrics.ranking - beforeMetrics.ranking)}
              isActive={isSimulated}
            />
            <MetricComparisonCard
              title="Answer Inclusion Rate"
              value={`${afterMetrics.air}%`}
              delta={afterMetrics.air - beforeMetrics.air}
              isActive={isSimulated}
            />
            <MetricComparisonCard
              title="Sentiment Score"
              value={afterMetrics.sentiment.toFixed(2)}
              delta={parseFloat((afterMetrics.sentiment - beforeMetrics.sentiment).toFixed(2))}
              isActive={isSimulated}
            />
          </div>
        </div>
      </div>

      {/* Simulation Details */}
      <AnimatePresence>
        {isSimulated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card className="p-6 border-success bg-success/5">
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="h-6 w-6 text-success" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2 text-success">Simulation Complete</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <strong>Key Changes:</strong>
                    </p>
                    <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                      <li>Added 3 high-DA citations (Forbes: 96, TechCrunch: 95, WSJ: 94)</li>
                      <li>Improved answer inclusion rate from 75% to 88%</li>
                      <li>Enhanced sentiment through positive case studies</li>
                      <li>Moved from #3 to #2 average ranking</li>
                      <li>Visibility score increased by 7 points (9% improvement)</li>
                    </ul>
                    <p className="mt-4 text-success font-medium">
                      Projected ROI: This improvement could lead to 15-20% increase in organic discovery
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function MetricComparisonCard({
  title,
  value,
  delta,
  isActive,
}: {
  title: string;
  value: string | number;
  delta?: number;
  isActive: boolean;
}) {
  return (
    <Card className={`p-4 transition-all ${isActive ? 'border-primary shadow-glow' : 'opacity-50'}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm text-muted-foreground mb-1">{title}</div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        {delta !== undefined && delta !== 0 && (
          <Badge variant="default" className="text-success bg-success/10">
            +{delta}
          </Badge>
        )}
      </div>
    </Card>
  );
}
