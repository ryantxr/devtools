import { useState, useCallback } from 'react';
import { useStore } from '../../store';
import { ToolCard } from '../ToolCard';
import { AlignLeft, LayoutPanelLeft, Minimize2, Trash2, Info } from 'lucide-react';
import { clsx } from 'clsx';

type FormatMode = '2-spaces' | '4-spaces' | 'minify';

export function JSONFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [mode, setMode] = useState<FormatMode>('2-spaces');
  const [error, setError] = useState<string | null>(null);
  const addHistory = useStore((state) => state.addHistory);

  const formatJSON = useCallback((val: string, currentMode: FormatMode) => {
    if (!val.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const parsed = JSON.parse(val);
      let result = '';
      
      if (currentMode === 'minify') {
        result = JSON.stringify(parsed);
      } else {
        const indent = currentMode === '2-spaces' ? 2 : 4;
        result = JSON.stringify(parsed, null, indent);
      }
      
      setOutput(result);
      setError(null);
      
      // Add to history only if valid and changed
      if (val.trim()) {
        addHistory('json-formatter', val, result);
      }
    } catch (err: any) {
      setError(err.message);
      setOutput('');
    }
  }, [addHistory]);

  const handleInputChange = (val: string) => {
    setInput(val);
    formatJSON(val, mode);
  };

  const handleModeChange = (newMode: FormatMode) => {
    setMode(newMode);
    formatJSON(input, newMode);
  };

  const handleClear = () => {
    setInput('');
    setOutput('');
    setError(null);
  };

  return (
    <ToolCard 
      title="JSON Formatter" 
      description="Clean up or compress your JSON data with instant validation."
      output={output || (error ? `Error: ${error}` : '')}
    >
      <div className="flex flex-col h-full">
        {/* Toolbar */}
        <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-1">
            <button
              onClick={() => handleModeChange('2-spaces')}
              className={clsx(
                "flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                mode === '2-spaces' ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>2 Spaces</span>
            </button>
            <button
              onClick={() => handleModeChange('4-spaces')}
              className={clsx(
                "flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                mode === '4-spaces' ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <LayoutPanelLeft className="w-3.5 h-3.5" />
              <span>4 Spaces</span>
            </button>
            <button
              onClick={() => handleModeChange('minify')}
              className={clsx(
                "flex items-center space-x-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                mode === 'minify' ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <Minimize2 className="w-3.5 h-3.5" />
              <span>Minify</span>
            </button>
          </div>
          
          <button
            onClick={handleClear}
            className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md transition-all"
            title="Clear input"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Editor Area */}
        <div className="relative flex-1 flex flex-col min-h-0">
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Paste your JSON here..."
            className={clsx(
              "flex-1 w-full p-4 font-mono text-sm bg-transparent border-none focus:outline-none resize-none hide-scrollbar selection:bg-primary/20",
              error && "text-destructive"
            )}
            spellCheck={false}
          />
          
          {error && (
            <div className="absolute bottom-4 right-4 max-w-[80%] animate-in fade-in slide-in-from-bottom-2">
              <div className="flex items-start space-x-2 p-3 bg-destructive/10 border border-destructive/20 rounded-lg backdrop-blur-sm">
                <Info className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-xs text-destructive font-medium leading-relaxed">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ToolCard>
  );
}
