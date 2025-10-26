-- Create storage bucket for CSV uploads
INSERT INTO storage.buckets (id, name, public) 
VALUES ('prompt-csvs', 'prompt-csvs', false);

-- Storage policies for CSV uploads
CREATE POLICY "Authenticated users can upload CSVs"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'prompt-csvs' AND auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated users can read their CSVs"
ON storage.objects
FOR SELECT
USING (bucket_id = 'prompt-csvs' AND auth.uid() IS NOT NULL);

-- Prompts table
CREATE TABLE public.prompts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  text TEXT NOT NULL,
  category TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prompts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own prompts"
ON public.prompts FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own prompts"
ON public.prompts FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Prompt answers table (stores LLM responses)
CREATE TABLE public.prompt_answers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  prompt_id UUID NOT NULL REFERENCES public.prompts(id) ON DELETE CASCADE,
  engine TEXT NOT NULL CHECK (engine IN ('ChatGPT', 'Gemini', 'Perplexity', 'Claude')),
  snippet TEXT NOT NULL,
  rank INTEGER,
  sentiment DECIMAL(3,2),
  highlighted TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.prompt_answers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view answers for their prompts"
ON public.prompt_answers FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.prompts 
  WHERE prompts.id = prompt_answers.prompt_id 
  AND prompts.user_id = auth.uid()
));

-- Citing domains table
CREATE TABLE public.citing_domains (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  answer_id UUID NOT NULL REFERENCES public.prompt_answers(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  url TEXT,
  domain_authority INTEGER,
  type TEXT CHECK (type IN ('owned', 'earned', 'competitor')),
  freshness INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.citing_domains ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view citations for their prompt answers"
ON public.citing_domains FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.prompt_answers 
  JOIN public.prompts ON prompts.id = prompt_answers.prompt_id
  WHERE prompt_answers.id = citing_domains.answer_id 
  AND prompts.user_id = auth.uid()
));

-- Metrics table (stores calculated aggregated metrics)
CREATE TABLE public.metrics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  metric_type TEXT NOT NULL,
  value DECIMAL(10,2),
  delta DECIMAL(10,2),
  metadata JSONB,
  calculated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.metrics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own metrics"
ON public.metrics FOR SELECT
USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_prompts_user_id ON public.prompts(user_id);
CREATE INDEX idx_prompt_answers_prompt_id ON public.prompt_answers(prompt_id);
CREATE INDEX idx_citing_domains_answer_id ON public.citing_domains(answer_id);
CREATE INDEX idx_metrics_user_id ON public.metrics(user_id);
CREATE INDEX idx_metrics_type ON public.metrics(metric_type);