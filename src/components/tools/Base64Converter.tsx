import { useState, useCallback } from 'react';
import { useStore } from '../../store';
import { ToolCard } from '../ToolCard';
import { Binary, ArrowLeftRight, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';

type Mode = 'encode' | 'decode';

export function Base64Converter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('encode');
  const [error, setError] = useState<string | null>(null);
  const addHistory = useStore((state) => state.addHistory);

  const convert = useCallback((val: string, currentMode: Mode) => {
    if (!val.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      let result = '';
      if (currentMode === 'encode') {
        // UTF-8 friendly encoding
        result = btoa(unescape(encodeURIComponent(val)));
      } else {
        // UTF-8 friendly decoding
        result = decodeURIComponent(escape(atob(val)));
      }
      setOutput(result);
      setError(null);
      addHistory('base64', val, result);
    } catch (err: any) {
      setError(err.message);
      setOutput('');
    }
  }, [addHistory]);

  const handleInputChange = (val: string) => {
    setInput(val);
    convert(val, mode);
  };

  const toggleMode = () => {
    const newMode = mode === 'encode' ? 'decode' : 'encode';
    setMode(newMode);
    setInput(output);
    convert(output, newMode);
  };

  return (
    <ToolCard 
      title="Base64 Converter" 
      description="Encode and decode text to Base64 format with UTF-8 support."
      output={output || (error ? `Error: ${error}` : '')}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Binary className="w-3.5 h-3.5" />
            <span>Mode: {mode === 'encode' ? 'Encode to Base64' : 'Decode to Text'}</span>
          </div>
          <button
            onClick={toggleMode}
            className="flex items-center space-x-1.5 px-2 py-1 rounded bg-primary/10 text-primary text-[10px] uppercase font-bold hover:bg-primary/20 transition-all border border-primary/20"
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>Switch</span>
          </button>
        </div>
        <div className="relative flex-1 flex flex-col min-h-0">
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={mode === 'encode' ? "Type text to encode..." : "Paste Base64 to decode..."}
            className={clsx(
              "flex-1 w-full p-4 font-mono text-sm bg-transparent border-none focus:outline-none resize-none hide-scrollbar selection:bg-primary/20",
              error && "text-destructive"
            )}
            spellCheck={false}
          />
          {error && (
            <div className="absolute bottom-4 right-4 flex items-center space-x-2 p-2 bg-destructive/10 border border-destructive/20 rounded-md animate-in fade-in slide-in-from-bottom-2">
              <AlertCircle className="w-4 h-4 text-destructive" />
              <p className="text-xs text-destructive font-medium">Invalid Base64</p>
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  );
}
