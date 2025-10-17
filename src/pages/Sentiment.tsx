import { Card } from '@/components/ui/card';
import { mockMetricData, mockPrompts } from '@/data/seedData';
import { Badge } from '@/components/ui/badge';
import { getSentimentColor, getSentimentLabel } from '@/lib/metrics';
import { ThumbsUp, ThumbsDown, Minus } from 'lucide-react';

export default function Sentiment() {
  const sortedBySentiment = [...mockPrompts].sort((a, b) => b.sentiment - a.sentiment);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Overall Sentiment</h1>
        <p className="text-muted-foreground">
          Sentiment analysis of brand mentions across LLM platforms
        </p>
      </div>

      {/* Sentiment Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="text-center">
            <div className="text-4xl font-bold text-primary mb-2">
              {mockMetricData.sentimentScore.toFixed(2)}
            </div>
            <div className="text-sm text-muted-foreground">Average Score</div>
            <Badge variant="default" className="mt-3">
              +{(mockMetricData.sentimentDelta * 100).toFixed(0)}% vs last period
            </Badge>
          </div>
        </Card>

        <Card className="p-6 border-success">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-success/10 flex items-center justify-center">
              <ThumbsUp className="h-5 w-5 text-success" />
            </div>
            <div className="text-2xl font-bold">{mockMetricData.sentimentMix.positive}%</div>
          </div>
          <div className="text-sm text-muted-foreground">Positive Mentions</div>
        </Card>

        <Card className="p-6 border-warning">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-warning/10 flex items-center justify-center">
              <Minus className="h-5 w-5 text-warning" />
            </div>
            <div className="text-2xl font-bold">{mockMetricData.sentimentMix.neutral}%</div>
          </div>
          <div className="text-sm text-muted-foreground">Neutral Mentions</div>
        </Card>

        <Card className="p-6 border-destructive">
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-full bg-destructive/10 flex items-center justify-center">
              <ThumbsDown className="h-5 w-5 text-destructive" />
            </div>
            <div className="text-2xl font-bold">{mockMetricData.sentimentMix.negative}%</div>
          </div>
          <div className="text-sm text-muted-foreground">Negative Mentions</div>
        </Card>
      </div>

      {/* Sentiment Distribution */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Sentiment Distribution</h3>
        <div className="h-6 flex rounded-lg overflow-hidden">
          <div
            className="bg-success flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${mockMetricData.sentimentMix.positive}%` }}
          >
            {mockMetricData.sentimentMix.positive}%
          </div>
          <div
            className="bg-warning flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${mockMetricData.sentimentMix.neutral}%` }}
          >
            {mockMetricData.sentimentMix.neutral}%
          </div>
          <div
            className="bg-destructive flex items-center justify-center text-white text-xs font-medium"
            style={{ width: `${mockMetricData.sentimentMix.negative}%` }}
          >
            {mockMetricData.sentimentMix.negative}%
          </div>
        </div>
      </Card>

      {/* Prompts Ranked by Sentiment */}
      <div>
        <h2 className="text-2xl font-bold mb-6">Prompts by Sentiment</h2>
        <div className="space-y-3">
          {sortedBySentiment.map((prompt) => (
            <Card
              key={prompt.id}
              className="p-5 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <p className="font-medium mb-2">{prompt.text}</p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">Rank #{prompt.visibilityRank}</Badge>
                    <Badge variant="secondary">{prompt.citationCount} citations</Badge>
                    <Badge variant="outline">{prompt.air}% AIR</Badge>
                  </div>
                </div>

                <div className="text-right">
                  <div className={`text-3xl font-bold ${getSentimentColor(prompt.sentiment)}`}>
                    {prompt.sentiment.toFixed(2)}
                  </div>
                  <Badge
                    variant={
                      prompt.sentimentType === 'positive' ? 'default' :
                      prompt.sentimentType === 'neutral' ? 'secondary' : 'destructive'
                    }
                    className="mt-2"
                  >
                    {getSentimentLabel(prompt.sentiment)}
                  </Badge>
                </div>
              </div>

              {/* Sample snippet from first answer */}
              {prompt.answers.length > 0 && (
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground mb-1">
                    Sample ({prompt.answers[0].engine}):
                  </div>
                  <p className="text-sm italic">&ldquo;{prompt.answers[0].snippet.substring(0, 150)}...&rdquo;</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
