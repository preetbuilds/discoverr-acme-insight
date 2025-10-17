export type LLMEngine = 'ChatGPT' | 'Gemini' | 'Perplexity' | 'Claude';
export type SentimentType = 'positive' | 'neutral' | 'negative';
export type DomainType = 'owned' | 'earned' | 'competitor';

export interface Prompt {
  id: string;
  text: string;
  visibilityRank: number;
  air: number;
  citationCount: number;
  topCitingDomain: string;
  sentiment: number;
  sentimentType: SentimentType;
  llmCoverage: LLMEngine[];
  freshness: number;
  promptVisibilityScore: number;
  answers: PromptAnswer[];
}

export interface PromptAnswer {
  engine: LLMEngine;
  snippet: string;
  citingDomains: CitingDomain[];
  rank: number;
  sentiment: number;
  highlighted: string;
}

export interface CitingDomain {
  domain: string;
  url: string;
  domainAuthority: number;
  type: DomainType;
  freshness: number;
}

export interface Competitor {
  name: string;
  sov: number;
  overlapIndex: number;
  avgRankGap: number;
  citationCount: number;
}

export interface TopicSource {
  domain: string;
  sharePercent: number;
  domainAuthority: number;
  type: DomainType;
  topPrompts: string[];
}

export interface MetricData {
  visibilityScore: number;
  visibilityDelta: number;
  overallRanking: number;
  rankingDelta: number;
  topAnswerRate: number;
  topAnswerRateDelta: number;
  sentimentScore: number;
  sentimentDelta: number;
  sentimentMix: {
    positive: number;
    neutral: number;
    negative: number;
  };
  topCompetitors: Competitor[];
  topicSources: TopicSource[];
  sparklineData: number[];
}

export interface GapFlag {
  type: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
}
