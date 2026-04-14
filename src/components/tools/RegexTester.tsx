import { useState, useMemo } from 'react';
import { useStore } from '../../store';
import { ToolCard } from '../ToolCard';
import { AlertCircle, CheckCircle2, List } from 'lucide-react';

export function RegexTester() {
  const [pattern, setPattern] = useState('');
  const [flags, setFlags] = useState('g');
  const [testString, setTestString] = useState('');
  const [error, setError] = useState<string | null>(null);
  const addHistory = useStore((state) => state.addHistory);

  const results = useMemo(() => {
    if (!pattern || !testString) return { matches: [], highlighted: testString };

    try {
      const regex = new RegExp(pattern, flags);
      const matches = Array.from(testString.matchAll(regex));
      
      const highlightedParts: React.ReactNode[] = [];
      let lastIndex = 0;

      matches.forEach((match, i) => {
        const index = match.index!;
        // Add text before match
        if (index > lastIndex) {
          highlightedParts.push(testString.substring(lastIndex, index));
        }
        // Add match with highlight
        highlightedParts.push(
          <mark 
            key={i} 
            className="bg-primary/30 text-primary-foreground border-b-2 border-primary rounded-sm px-0.5"
          >
            {match[0]}
          </mark>
        );
        lastIndex = index + match[0].length;
      });

      // Add remaining text
      if (lastIndex < testString.length) {
        highlightedParts.push(testString.substring(lastIndex));
      }

      setError(null);
      return { matches, highlighted: highlightedParts };
    } catch (err: any) {
      setError(err.message);
      return { matches: [], highlighted: testString };
    }
  }, [pattern, flags, testString]);

  const handleInputChange = (p: string, f: string, t: string) => {
    setPattern(p);
    setFlags(f);
    setTestString(t);
    
    if (p && t) {
      addHistory('regex-tester', `[/${p}/${f}] ${t}`, `Found ${results.matches.length} matches`);
    }
  };

  return (
    <ToolCard 
      title="Regex Tester" 
      description="Test your regular expressions with real-time match highlighting and detail inspection."
      output={
        <div className="flex flex-col h-full">
          <div className="bg-muted/10 p-4 font-mono text-sm whitespace-pre-wrap flex-1 overflow-auto leading-relaxed">
            {results.highlighted}
          </div>
          
          {results.matches.length > 0 && (
            <div className="p-4 border-t border-border bg-background">
              <div className="flex items-center space-x-2 mb-3 px-1">
                <List className="w-4 h-4 text-primary" />
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Match Details ({results.matches.length})
                </span>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                {results.matches.map((match, i) => (
                  <div key={i} className="text-[11px] p-2 bg-muted/30 rounded border border-border/50 font-mono">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-primary font-bold">Match #{i + 1}</span>
                      <span className="text-muted-foreground">Index: {match.index}</span>
                    </div>
                    <div className="text-foreground break-all">{match[0]}</div>
                    {match.length > 1 && (
                      <div className="mt-1 pt-1 border-t border-border/30 text-muted-foreground italic">
                        Groups: {match.slice(1).join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      }
    >
      <div className="flex flex-col h-full space-y-4 p-4">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
            Regex Pattern
          </label>
          <div className="flex items-center space-x-2">
            <div className="flex-1 relative group">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/</span>
              <input
                type="text"
                value={pattern}
                onChange={(e) => handleInputChange(e.target.value, flags, testString)}
                placeholder="([a-z]+)"
                className="w-full pl-6 pr-10 py-2.5 bg-muted/30 border border-border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-mono">/</span>
            </div>
            <input
              type="text"
              value={flags}
              onChange={(e) => handleInputChange(pattern, e.target.value, testString)}
              placeholder="gi"
              className="w-16 px-3 py-2.5 bg-muted/30 border border-border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 text-center"
              title="Flags (g, i, m, s, u, y)"
            />
          </div>
        </div>

        <div className="flex-1 flex flex-col space-y-2">
          <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
            Test String
          </label>
          <textarea
            value={testString}
            onChange={(e) => handleInputChange(pattern, flags, e.target.value)}
            placeholder="Type text to test matches against..."
            className="flex-1 w-full p-4 font-mono text-sm bg-muted/30 border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none selection:bg-primary/20"
            spellCheck={false}
          />
        </div>

        {error ? (
          <div className="flex items-center space-x-2 text-destructive p-2 bg-destructive/10 rounded-lg">
            <AlertCircle className="w-4 h-4" />
            <p className="text-xs font-semibold">{error}</p>
          </div>
        ) : pattern && testString && (
          <div className="flex items-center space-x-2 text-primary p-2 bg-primary/10 rounded-lg">
            <CheckCircle2 className="w-4 h-4" />
            <p className="text-xs font-semibold">Valid Regex • {results.matches.length} matches found</p>
          </div>
        )}
      </div>
    </ToolCard>
  );
}
