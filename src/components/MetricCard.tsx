import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { motion } from 'framer-motion';

interface MetricCardProps {
  title: string;
  value: string | number;
  delta: number;
  sparklineData: number[];
  description: string;
  formula?: string;
  onClick?: () => void;
}

export function MetricCard({ title, value, delta, sparklineData, description, formula, onClick }: MetricCardProps) {
  const isPositive = delta > 0;
  const max = Math.max(...sparklineData);
  const min = Math.min(...sparklineData);
  const range = max - min || 1;

  const points = sparklineData.map((val, i) => {
    const x = (i / (sparklineData.length - 1)) * 100;
    const y = 100 - ((val - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        className="metric-card p-6 relative overflow-hidden"
        onClick={onClick}
      >
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Info className="h-3 w-3 text-muted-foreground" />
                </TooltipTrigger>
                <TooltipContent className="max-w-xs">
                  <p className="text-sm mb-2">{description}</p>
                  {formula && <p className="text-xs text-muted-foreground font-mono">{formula}</p>}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
          <div className={`flex items-center gap-1 text-xs ${isPositive ? 'text-success' : 'text-destructive'}`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>{Math.abs(delta)}{typeof value === 'number' && value < 10 ? '' : '%'}</span>
          </div>
        </div>

        <div className="mb-4">
          <div className="text-4xl font-bold animate-count-up">{value}</div>
        </div>

        <div className="h-12 w-full">
          <svg viewBox="0 0 100 100" className="w-full h-full" preserveAspectRatio="none">
            <polyline
              points={points}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              className="sparkline-path"
              vectorEffect="non-scaling-stroke"
            />
            <polyline
              points={points}
              fill="url(#gradient)"
              stroke="none"
              opacity="0.2"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </Card>
    </motion.div>
  );
}
