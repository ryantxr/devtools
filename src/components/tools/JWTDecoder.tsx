import { useState, useCallback } from 'react';
import { useStore } from '../../store';
import { ToolCard } from '../ToolCard';
import { Key, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

export function JWTDecoder() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const addHistory = useStore((state) => state.addHistory);

  const decodeJWT = useCallback((token: string) => {
    if (!token.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const parts = token.split('.');
      if (parts.length < 2 || parts.length > 3) {
        throw new Error('Invalid JWT format. A JWT must have 2 or 3 parts separated by dots.');
      }

      const decodeBase64 = (str: string) => {
        try {
          // Add padding if necessary
          const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
          const pad = base64.length % 4;
          const padded = pad ? base64 + '='.repeat(4 - pad) : base64;
          return JSON.parse(decodeURIComponent(escape(atob(padded))));
        } catch (e) {
          throw new Error('Failed to decode part: ' + e);
        }
      };

      const header = decodeBase64(parts[0]);
      const payload = decodeBase64(parts[1]);
      
      const result = JSON.stringify({
        header,
        payload,
        signature: parts.length === 3 ? 'Present (Verification not implemented in MVP)' : 'None'
      }, null, 2);

      setOutput(result);
      setError(null);
      addHistory('jwt-decoder', token, result);
    } catch (err: any) {
      setError(err.message);
      setOutput('');
    }
  }, [addHistory]);

  const handleInputChange = (val: string) => {
    setInput(val);
    decodeJWT(val);
  };

  return (
    <ToolCard 
      title="JWT Decoder" 
      description="Decode JSON Web Tokens and inspect their claims instantly."
      output={output || (error ? `Error: ${error}` : '')}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Key className="w-3.5 h-3.5" />
            <span>JWT String</span>
          </div>
        </div>
        <div className="relative flex-1 flex flex-col min-h-0">
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste your JWT here (header.payload.signature)..."
            className={clsx(
              "flex-1 w-full p-4 font-mono text-sm bg-transparent border-none focus:outline-none resize-none hide-scrollbar selection:bg-primary/20",
              error && "text-destructive"
            )}
            spellCheck={false}
          />
          {error && (
            <div className="absolute bottom-4 right-4 flex items-center space-x-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-xs text-destructive font-medium">{error}</p>
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  );
}
