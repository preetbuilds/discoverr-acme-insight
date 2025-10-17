import { Prompt, MetricData } from '@/types';

const ENGINE_WEIGHTS = {
  'ChatGPT': 0.4,
  'Gemini': 0.3,
  'Perplexity': 0.2,
  'Claude': 0.1
};

export function calculateAIR(prompt: Prompt): number {
  const totalEngines = 4;
  const includedEngines = prompt.llmCoverage.length;
  return (includedEngines / totalEngines) * 100;
}

export function calculatePromptVisibilityScore(prompt: Prompt): number {
  let weightedPresence = 0;
  
  prompt.answers.forEach(answer => {
    const engineWeight = ENGINE_WEIGHTS[answer.engine] || 0.1;
    weightedPresence += engineWeight;
  });

  const normalizedRank = 1 - (prompt.visibilityRank / 100);
  return weightedPresence * normalizedRank * 100;
}

export function calculateVisibilityScore(prompts: Prompt[], metricData: MetricData): number {
  const avgPromptVisibility = prompts.reduce((acc, p) => acc + p.promptVisibilityScore, 0) / prompts.length;
  const authorityReach = calculateAuthorityReach(prompts);
  const promptCoverage = (prompts.filter(p => p.llmCoverage.length > 0).length / prompts.length) * 100;
  const freshness = calculateFreshnessScore(prompts);

  return Math.round(
    0.5 * avgPromptVisibility +
    0.2 * authorityReach +
    0.2 * promptCoverage +
    0.1 * freshness
  );
}

function calculateAuthorityReach(prompts: Prompt[]): number {
  const highAuthorityCitations = prompts.flatMap(p => 
    p.answers.flatMap(a => 
      a.citingDomains.filter(d => d.domainAuthority >= 80)
    )
  );
  
  return Math.min(100, highAuthorityCitations.length * 5);
}

function calculateFreshnessScore(prompts: Prompt[]): number {
  const avgFreshness = prompts.reduce((acc, p) => acc + p.freshness, 0) / prompts.length;
  return Math.max(0, 100 - (avgFreshness * 5));
}

export function calculateSOV(brandCitations: number, totalCitations: number): number {
  return (brandCitations / totalCitations) * 100;
}

export function formatDelta(value: number, isPercentage: boolean = false): string {
  const prefix = value > 0 ? '+' : '';
  const suffix = isPercentage ? '%' : '';
  return `${prefix}${value}${suffix}`;
}

export function getSentimentColor(sentiment: number): string {
  if (sentiment >= 0.5) return 'text-success';
  if (sentiment >= 0) return 'text-muted-foreground';
  return 'text-destructive';
}

export function getSentimentLabel(sentiment: number): string {
  if (sentiment >= 0.5) return 'Positive';
  if (sentiment >= 0) return 'Neutral';
  return 'Negative';
}
