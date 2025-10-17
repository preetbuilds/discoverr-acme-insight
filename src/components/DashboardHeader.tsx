import { Search, ChevronDown, Code2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';

export function DashboardHeader() {
  const [selectedEngines, setSelectedEngines] = useState<string[]>(['ChatGPT', 'Gemini', 'Perplexity', 'Claude']);
  const [devMode, setDevMode] = useState(false);

  const toggleEngine = (engine: string) => {
    setSelectedEngines(prev =>
      prev.includes(engine)
        ? prev.filter(e => e !== engine)
        : [...prev, engine]
    );
  };

  return (
    <header className="border-b bg-card sticky top-0 z-10 shadow-sm">
      <div className="flex items-center justify-between px-6 py-3">
        <div className="flex items-center gap-4">
          <SidebarTrigger />
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <div>
                <h1 className="text-sm font-semibold">Discovrr</h1>
                <p className="text-xs text-muted-foreground">AcmeCRM</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search prompts..."
              className="pl-9 w-64"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Engines ({selectedEngines.length})
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {['ChatGPT', 'Gemini', 'Perplexity', 'Claude'].map(engine => (
                <DropdownMenuCheckboxItem
                  key={engine}
                  checked={selectedEngines.includes(engine)}
                  onCheckedChange={() => toggleEngine(engine)}
                >
                  {engine}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Button
            variant={devMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setDevMode(!devMode)}
          >
            <Code2 className="h-4 w-4 mr-2" />
            Dev
          </Button>

          <Badge variant="outline" className="text-xs">
            Last 28 days
          </Badge>
        </div>
      </div>
    </header>
  );
}
