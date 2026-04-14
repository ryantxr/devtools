import { useState, useCallback } from 'react';
import { useStore } from '../../store';
import { ToolCard } from '../ToolCard';
import { Terminal, Globe, List, Braces, AlertCircle } from 'lucide-react';

interface ParsedCurl {
  method: string;
  url: string;
  headers: Record<string, string>;
  body: string;
  query: Record<string, string>;
}

export function CurlConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [parsed, setParsed] = useState<ParsedCurl | null>(null);
  const [error, setError] = useState<string | null>(null);
  const addHistory = useStore((state) => state.addHistory);

  const parseCurl = useCallback((cmd: string) => {
    if (!cmd.trim()) {
      setOutput('');
      setParsed(null);
      setError(null);
      return;
    }

    try {
      // Basic cURL parser logic
      const result: ParsedCurl = {
        method: 'GET',
        url: '',
        headers: {},
        body: '',
        query: {}
      };

      // Extract URL (first quoted string or first non-flag string)
      const urlMatch = cmd.match(/(?:['"])(https?:\/\/[^\s'"]+)(?:['"])|(https?:\/\/[^\s]+)/);
      if (urlMatch) {
        result.url = urlMatch[1] || urlMatch[2];
        try {
          const urlObj = new URL(result.url);
          urlObj.searchParams.forEach((val, key) => {
            result.query[key] = val;
          });
        } catch (e) {
          // Fallback if URL is partial
        }
      }

      // Extract Method
      const methodMatch = cmd.match(/-X\s+([A-Z]+)|--request\s+([A-Z]+)/);
      if (methodMatch) {
        result.method = methodMatch[1] || methodMatch[2];
      } else if (cmd.includes('--data') || cmd.includes('-d ') || cmd.includes('--json')) {
        result.method = 'POST';
      }

      // Extract Headers
      const headerMatches = cmd.matchAll(/-H\s+['"]([^'"]+)['"]|--header\s+['"]([^'"]+)['"]/g);
      for (const match of headerMatches) {
        const header = match[1] || match[2];
        const [key, ...valParts] = header.split(':');
        if (key) {
          result.headers[key.trim()] = valParts.join(':').trim();
        }
      }

      // Extract Body
      const bodyMatch = cmd.match(/(?:-d|--data|--data-raw|--json)\s+['"]([^'"]+)['"]/);
      if (bodyMatch) {
        result.body = bodyMatch[1];
      }

      setParsed(result);
      setError(null);

      const formatted = [
        `${result.method} ${result.url}`,
        '',
        `HEADERS:`,
        JSON.stringify(result.headers, null, 2),
        '',
        `BODY:`,
        result.body || '(Empty)'
      ].join('\n');

      setOutput(formatted);
      addHistory('curl-converter', cmd, formatted);
    } catch (err: any) {
      setError('Failed to parse cURL command. Ensure it is a valid format.');
      setOutput('');
      setParsed(null);
    }
  }, [addHistory]);

  const handleInputChange = (val: string) => {
    setInput(val);
    parseCurl(val);
  };

  return (
    <ToolCard 
      title="cURL Converter" 
      description="Convert complex cURL commands into structured, readable HTTP request details."
      output={output || (error ? `Error: ${error}` : '')}
    >
      <div className="flex flex-col h-full overflow-hidden">
        <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Terminal className="w-3.5 h-3.5" />
            <span>cURL Command</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={'curl -X POST https://api.example.com/v1/users -H "Content-Type: application/json" -d \'{"name": "John"}\''}
            className="flex-1 w-full p-4 font-mono text-sm bg-transparent border-none focus:outline-none resize-none hide-scrollbar selection:bg-primary/20"
            spellCheck={false}
          />
        </div>

        {parsed && (
          <div className="p-4 border-t border-border bg-background space-y-4 animate-in fade-in slide-in-from-bottom-2 max-h-64 overflow-y-auto custom-scrollbar">
            <div className="flex items-center space-x-2">
              <Globe className="w-4 h-4 text-primary" />
              <div className="flex items-center space-x-2">
                <span className="px-1.5 py-0.5 bg-primary/10 text-primary text-[10px] font-bold rounded uppercase">{parsed.method}</span>
                <span className="text-[11px] font-mono text-foreground truncate max-w-xs">{parsed.url}</span>
              </div>
            </div>

            {Object.keys(parsed.headers).length > 0 && (
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <List className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Headers</span>
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {Object.entries(parsed.headers).map(([k, v]) => (
                    <div key={k} className="flex text-[10px] font-mono">
                      <span className="text-primary font-bold">{k}:</span>
                      <span className="text-foreground/70 ml-2 truncate">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {parsed.body && (
              <div className="space-y-1.5">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Braces className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Request Body</span>
                </div>
                <pre className="p-2 bg-muted/30 rounded text-[10px] font-mono whitespace-pre-wrap break-all text-foreground/80">
                  {parsed.body}
                </pre>
              </div>
            )}
          </div>
        )}

        {error && (
          <div className="p-4 flex items-center space-x-2 text-destructive">
            <AlertCircle className="w-4 h-4" />
            <p className="text-xs font-semibold">{error}</p>
          </div>
        )}
      </div>
    </ToolCard>
  );
}
