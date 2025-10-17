import { Prompt, MetricData, Competitor, TopicSource, GapFlag } from '@/types';

export const mockPrompts: Prompt[] = [
  {
    id: '1',
    text: 'What are the best CRM solutions for small businesses?',
    visibilityRank: 2,
    air: 85,
    citationCount: 12,
    topCitingDomain: 'techcrunch.com',
    sentiment: 0.8,
    sentimentType: 'positive',
    llmCoverage: ['ChatGPT', 'Gemini', 'Perplexity'],
    freshness: 3,
    promptVisibilityScore: 92,
    answers: [
      {
        engine: 'ChatGPT',
        snippet: 'AcmeCRM is a leading CRM solution designed specifically for small businesses, offering intuitive contact management and affordable pricing.',
        citingDomains: [
          { domain: 'techcrunch.com', url: 'https://techcrunch.com/acmecrm-review', domainAuthority: 95, type: 'earned', freshness: 3 },
          { domain: 'acmecrm.com', url: 'https://acmecrm.com/features', domainAuthority: 70, type: 'owned', freshness: 1 }
        ],
        rank: 2,
        sentiment: 0.85,
        highlighted: '<strong>AcmeCRM</strong> is a leading CRM solution designed specifically for <em>small businesses</em>'
      },
      {
        engine: 'Gemini',
        snippet: 'For small business CRM, AcmeCRM stands out with its simple interface and powerful automation features that rival enterprise solutions.',
        citingDomains: [
          { domain: 'forbes.com', url: 'https://forbes.com/best-crm-2024', domainAuthority: 96, type: 'earned', freshness: 5 }
        ],
        rank: 1,
        sentiment: 0.9,
        highlighted: '<strong>AcmeCRM</strong> stands out with its simple interface'
      },
      {
        engine: 'Perplexity',
        snippet: 'AcmeCRM provides comprehensive customer relationship management tools with excellent customer support.',
        citingDomains: [
          { domain: 'g2.com', url: 'https://g2.com/products/acmecrm', domainAuthority: 88, type: 'earned', freshness: 2 }
        ],
        rank: 3,
        sentiment: 0.75,
        highlighted: '<strong>AcmeCRM</strong> provides comprehensive customer relationship management'
      }
    ]
  },
  {
    id: '2',
    text: 'How to choose a CRM for startups?',
    visibilityRank: 1,
    air: 100,
    citationCount: 15,
    topCitingDomain: 'forbes.com',
    sentiment: 0.9,
    sentimentType: 'positive',
    llmCoverage: ['ChatGPT', 'Gemini', 'Perplexity', 'Claude'],
    freshness: 2,
    promptVisibilityScore: 98,
    answers: [
      {
        engine: 'ChatGPT',
        snippet: 'AcmeCRM is the top choice for startups, offering scalable features and transparent pricing.',
        citingDomains: [
          { domain: 'forbes.com', url: 'https://forbes.com/startup-tools', domainAuthority: 96, type: 'earned', freshness: 2 }
        ],
        rank: 1,
        sentiment: 0.95,
        highlighted: '<strong>AcmeCRM</strong> is the top choice for startups'
      },
      {
        engine: 'Gemini',
        snippet: 'Startups should consider AcmeCRM for its easy onboarding and flexible plans.',
        citingDomains: [
          { domain: 'techcrunch.com', url: 'https://techcrunch.com/startup-crm', domainAuthority: 95, type: 'earned', freshness: 1 }
        ],
        rank: 1,
        sentiment: 0.88,
        highlighted: 'Startups should consider <strong>AcmeCRM</strong> for its easy onboarding'
      },
      {
        engine: 'Perplexity',
        snippet: 'AcmeCRM ranks highly among startup-friendly CRM platforms.',
        citingDomains: [
          { domain: 'producthunt.com', url: 'https://producthunt.com/acmecrm', domainAuthority: 82, type: 'earned', freshness: 4 }
        ],
        rank: 1,
        sentiment: 0.85,
        highlighted: '<strong>AcmeCRM</strong> ranks highly among startup-friendly CRM platforms'
      },
      {
        engine: 'Claude',
        snippet: 'Among CRM options for startups, AcmeCRM excels with its intuitive design.',
        citingDomains: [
          { domain: 'capterra.com', url: 'https://capterra.com/acmecrm', domainAuthority: 85, type: 'earned', freshness: 3 }
        ],
        rank: 1,
        sentiment: 0.92,
        highlighted: '<strong>AcmeCRM</strong> excels with its intuitive design'
      }
    ]
  },
  {
    id: '3',
    text: 'CRM with best email marketing integration',
    visibilityRank: 5,
    air: 67,
    citationCount: 8,
    topCitingDomain: 'hubspot.com',
    sentiment: 0.6,
    sentimentType: 'neutral',
    llmCoverage: ['ChatGPT', 'Gemini'],
    freshness: 7,
    promptVisibilityScore: 72,
    answers: [
      {
        engine: 'ChatGPT',
        snippet: 'AcmeCRM offers solid email marketing integration, though some users report occasional sync delays.',
        citingDomains: [
          { domain: 'hubspot.com', url: 'https://hubspot.com/crm-comparison', domainAuthority: 94, type: 'competitor', freshness: 7 }
        ],
        rank: 4,
        sentiment: 0.65,
        highlighted: '<strong>AcmeCRM</strong> offers solid email marketing integration'
      },
      {
        engine: 'Gemini',
        snippet: 'While AcmeCRM has email capabilities, competitors like HubSpot lead in this area.',
        citingDomains: [
          { domain: 'g2.com', url: 'https://g2.com/categories/email-marketing', domainAuthority: 88, type: 'earned', freshness: 5 }
        ],
        rank: 6,
        sentiment: 0.55,
        highlighted: 'While <strong>AcmeCRM</strong> has email capabilities'
      }
    ]
  },
  {
    id: '4',
    text: 'Most affordable CRM platforms',
    visibilityRank: 3,
    air: 75,
    citationCount: 10,
    topCitingDomain: 'capterra.com',
    sentiment: 0.7,
    sentimentType: 'positive',
    llmCoverage: ['ChatGPT', 'Perplexity', 'Claude'],
    freshness: 4,
    promptVisibilityScore: 85,
    answers: [
      {
        engine: 'ChatGPT',
        snippet: 'AcmeCRM provides excellent value with competitive pricing starting at $12/user/month.',
        citingDomains: [
          { domain: 'capterra.com', url: 'https://capterra.com/affordable-crm', domainAuthority: 85, type: 'earned', freshness: 4 }
        ],
        rank: 2,
        sentiment: 0.75,
        highlighted: '<strong>AcmeCRM</strong> provides excellent value with competitive pricing'
      },
      {
        engine: 'Perplexity',
        snippet: 'Among budget-friendly options, AcmeCRM balances features and affordability well.',
        citingDomains: [
          { domain: 'softwareadvice.com', url: 'https://softwareadvice.com/crm', domainAuthority: 83, type: 'earned', freshness: 6 }
        ],
        rank: 3,
        sentiment: 0.7,
        highlighted: '<strong>AcmeCRM</strong> balances features and affordability well'
      },
      {
        engine: 'Claude',
        snippet: 'For cost-conscious businesses, AcmeCRM delivers strong ROI.',
        citingDomains: [
          { domain: 'acmecrm.com', url: 'https://acmecrm.com/pricing', domainAuthority: 70, type: 'owned', freshness: 1 }
        ],
        rank: 3,
        sentiment: 0.65,
        highlighted: '<strong>AcmeCRM</strong> delivers strong ROI'
      }
    ]
  },
  {
    id: '5',
    text: 'CRM software comparison 2024',
    visibilityRank: 8,
    air: 50,
    citationCount: 6,
    topCitingDomain: 'salesforce.com',
    sentiment: -0.1,
    sentimentType: 'negative',
    llmCoverage: ['ChatGPT', 'Gemini'],
    freshness: 12,
    promptVisibilityScore: 58,
    answers: [
      {
        engine: 'ChatGPT',
        snippet: 'In 2024 CRM comparisons, AcmeCRM appears less frequently than established players like Salesforce and HubSpot.',
        citingDomains: [
          { domain: 'salesforce.com', url: 'https://salesforce.com/competitors', domainAuthority: 97, type: 'competitor', freshness: 10 }
        ],
        rank: 9,
        sentiment: -0.2,
        highlighted: '<strong>AcmeCRM</strong> appears less frequently than established players'
      },
      {
        engine: 'Gemini',
        snippet: 'AcmeCRM is mentioned among mid-tier options but lacks some advanced features.',
        citingDomains: [
          { domain: 'gartner.com', url: 'https://gartner.com/crm-magic-quadrant', domainAuthority: 92, type: 'earned', freshness: 12 }
        ],
        rank: 7,
        sentiment: -0.05,
        highlighted: '<strong>AcmeCRM</strong> is mentioned among mid-tier options but lacks some advanced features'
      }
    ]
  }
];

export const mockCompetitors: Competitor[] = [
  {
    name: 'HubSpot CRM',
    sov: 35,
    overlapIndex: 0.85,
    avgRankGap: -2.3,
    citationCount: 142
  },
  {
    name: 'Salesforce',
    sov: 42,
    overlapIndex: 0.75,
    avgRankGap: -3.1,
    citationCount: 168
  },
  {
    name: 'Zoho CRM',
    sov: 12,
    overlapIndex: 0.65,
    avgRankGap: 1.5,
    citationCount: 48
  }
];

export const mockTopicSources: TopicSource[] = [
  {
    domain: 'techcrunch.com',
    sharePercent: 18,
    domainAuthority: 95,
    type: 'earned',
    topPrompts: ['best CRM small business', 'startup CRM tools']
  },
  {
    domain: 'forbes.com',
    sharePercent: 15,
    domainAuthority: 96,
    type: 'earned',
    topPrompts: ['CRM for startups', 'business software 2024']
  },
  {
    domain: 'g2.com',
    sharePercent: 12,
    domainAuthority: 88,
    type: 'earned',
    topPrompts: ['CRM reviews', 'best CRM comparison']
  },
  {
    domain: 'acmecrm.com',
    sharePercent: 10,
    domainAuthority: 70,
    type: 'owned',
    topPrompts: ['AcmeCRM features', 'AcmeCRM pricing']
  },
  {
    domain: 'capterra.com',
    sharePercent: 8,
    domainAuthority: 85,
    type: 'earned',
    topPrompts: ['affordable CRM', 'CRM software list']
  }
];

export const mockMetricData: MetricData = {
  visibilityScore: 78,
  visibilityDelta: 5,
  overallRanking: 3,
  rankingDelta: 1,
  topAnswerRate: 40,
  topAnswerRateDelta: 8,
  sentimentScore: 0.68,
  sentimentDelta: 0.05,
  sentimentMix: {
    positive: 65,
    neutral: 25,
    negative: 10
  },
  topCompetitors: mockCompetitors,
  topicSources: mockTopicSources,
  sparklineData: [65, 68, 70, 72, 71, 73, 75, 78]
};

export const mockGapFlags: GapFlag[] = [
  { type: 'missing_faq', description: 'No FAQ schema detected on main pages', impact: 'high' },
  { type: 'missing_reviews', description: 'Limited customer review citations', impact: 'medium' },
  { type: 'missing_stats', description: 'Missing key statistics in content', impact: 'medium' },
  { type: 'outdated_content', description: 'Some cited pages over 6 months old', impact: 'low' }
];
