import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import * as XLSX from 'xlsx';

export default function UploadPrompts() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [brandName, setBrandName] = useState('BlackBaza');
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'complete' | 'error'>('idle');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls') || selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setStatus('idle');
      } else {
        toast({
          title: 'Invalid file type',
          description: 'Please upload an Excel (.xlsx, .xls) or CSV file',
          variant: 'destructive',
        });
      }
    }
  };

  const parseExcelFile = async (file: File): Promise<string[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });
          
          // Extract prompts (assuming first column contains prompts, skip header)
          const prompts = jsonData
            .slice(1) // Skip header row
            .map((row: any) => row[0])
            .filter((prompt: any) => prompt && typeof prompt === 'string' && prompt.trim() !== '');
          
          resolve(prompts);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleUpload = async () => {
    if (!file || !brandName.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please select a file and enter a brand name',
        variant: 'destructive',
      });
      return;
    }

    setProcessing(true);
    setStatus('uploading');
    setProgress(10);

    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('You must be logged in to upload prompts');
      }

      // Parse the Excel file
      setProgress(20);
      const prompts = await parseExcelFile(file);
      
      if (prompts.length === 0) {
        throw new Error('No prompts found in the file');
      }

      toast({
        title: 'File parsed',
        description: `Found ${prompts.length} prompts. Processing with GPT...`,
      });

      setStatus('processing');
      setProgress(40);

      // Call edge function to process prompts
      const { data, error } = await supabase.functions.invoke('process-prompts', {
        body: {
          prompts,
          userId: user.id,
          brandName: brandName.trim()
        }
      });

      if (error) {
        throw error;
      }

      setProgress(100);
      setStatus('complete');

      toast({
        title: 'Processing complete!',
        description: `Successfully processed ${data.processedCount} prompts for ${brandName}`,
      });

      // Navigate to overview after 2 seconds
      setTimeout(() => {
        navigate('/overview');
      }, 2000);

    } catch (error: any) {
      console.error('Error uploading prompts:', error);
      setStatus('error');
      toast({
        title: 'Upload failed',
        description: error.message || 'Failed to process prompts. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20 p-6">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Upload Prompts</h1>
          <p className="text-muted-foreground">
            Upload your CSV or Excel file with prompts to analyze with AI
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Configuration</CardTitle>
            <CardDescription>
              Provide your prompt list and brand name for analysis
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="brand">Brand Name</Label>
              <Input
                id="brand"
                value={brandName}
                onChange={(e) => setBrandName(e.target.value)}
                placeholder="e.g., BlackBaza"
                disabled={processing}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="file">Prompt File</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="file"
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileChange}
                  disabled={processing}
                  className="cursor-pointer"
                />
                {file && !processing && (
                  <CheckCircle2 className="w-5 h-5 text-success" />
                )}
              </div>
              {file && (
                <p className="text-sm text-muted-foreground">
                  Selected: {file.name}
                </p>
              )}
            </div>

            {processing && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {status === 'uploading' && 'Uploading and parsing file...'}
                    {status === 'processing' && 'Processing with GPT...'}
                  </span>
                  <span className="font-medium">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </div>
            )}

            {status === 'complete' && (
              <div className="flex items-center gap-2 p-4 bg-success/10 border border-success/20 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-success" />
                <p className="text-sm text-success">
                  Processing complete! Redirecting to dashboard...
                </p>
              </div>
            )}

            {status === 'error' && (
              <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <AlertCircle className="w-5 h-5 text-destructive" />
                <p className="text-sm text-destructive">
                  Processing failed. Please try again.
                </p>
              </div>
            )}

            <Button
              onClick={handleUpload}
              disabled={!file || !brandName.trim() || processing}
              className="w-full"
              size="lg"
            >
              {processing ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload & Process
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle className="text-lg">File Format Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• File must be in Excel (.xlsx, .xls) or CSV format</p>
            <p>• First column should contain prompts (one per row)</p>
            <p>• First row is treated as header and will be skipped</p>
            <p>• Empty rows will be automatically filtered out</p>
            <p>• Processing may take 2-5 minutes for 100 prompts</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
