import { useState, useCallback } from 'react';
import { useStore } from '../../store';
import { ToolCard } from '../ToolCard';
import { FileType, ArrowRightLeft, AlertCircle } from 'lucide-react';
import yaml from 'js-yaml';
import { clsx } from 'clsx';

type Mode = 'yaml-to-json' | 'json-to-yaml';

export function YAMLJSONConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<Mode>('yaml-to-json');
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
      if (currentMode === 'yaml-to-json') {
        const parsed = yaml.load(val);
        result = JSON.stringify(parsed, null, 2);
      } else {
        const parsed = JSON.parse(val);
        result = yaml.dump(parsed, { indent: 2 });
      }
      setOutput(result);
      setError(null);
      addHistory('yaml-json', val, result);
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
    const newMode = mode === 'yaml-to-json' ? 'json-to-yaml' : 'yaml-to-json';
    setMode(newMode);
    setInput(output);
    convert(output, newMode);
  };

  return (
    <ToolCard 
      title="YAML ↔ JSON Converter" 
      description="Convert between YAML and JSON formats with validation and formatting."
      output={output || (error ? `Error: ${error}` : '')}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <FileType className="w-3.5 h-3.5" />
            <span>Mode: {mode === 'yaml-to-json' ? 'YAML to JSON' : 'JSON to YAML'}</span>
          </div>
          <button
            onClick={toggleMode}
            className="flex items-center space-x-1.5 px-2 py-1 rounded bg-primary/10 text-primary text-[10px] uppercase font-bold hover:bg-primary/20 transition-all border border-primary/20"
          >
            <ArrowRightLeft className="w-3 h-3" />
            <span>Switch</span>
          </button>
        </div>
        <div className="relative flex-1 flex flex-col min-h-0">
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder={mode === 'yaml-to-json' ? "Paste YAML here..." : "Paste JSON here..."}
            className={clsx(
              "flex-1 w-full p-4 font-mono text-sm bg-transparent border-none focus:outline-none resize-none hide-scrollbar selection:bg-primary/20",
              error && "text-destructive"
            )}
            spellCheck={false}
          />
          {error && (
            <div className="absolute bottom-4 right-4 flex items-center space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-md animate-in fade-in slide-in-from-bottom-2 backdrop-blur-sm">
              <AlertCircle className="w-4 h-4 text-destructive shrink-0" />
              <p className="text-[11px] text-destructive font-semibold line-clamp-2">{error}</p>
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  );
}
