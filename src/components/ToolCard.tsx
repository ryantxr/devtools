import React from 'react';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';


interface ToolCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  output?: React.ReactNode;
  onCopy?: () => void;
}

export function ToolCard({ title, description, children, output, onCopy }: ToolCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy = typeof output === 'string' ? output : '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      onCopy?.();
    }
  };

  return (
    <div className="flex flex-col h-full space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col">
        <h2 className="text-3xl font-bold tracking-tight text-foreground">{title}</h2>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1 min-h-[500px]">
        {/* Input Area */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Input</span>
          </div>
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-brand rounded-xl blur opacity-10 group-focus-within:opacity-25 transition duration-500"></div>
            <div className="relative h-full bg-card border border-border rounded-xl shadow-sm focus-within:ring-2 focus-within:ring-primary/20 transition-all overflow-hidden flex flex-col">
              {children}
            </div>
          </div>
        </div>

        {/* Output Area */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Output</span>
            {output && (
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 text-xs font-medium text-muted-foreground hover:text-primary transition-colors cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-green-500" />
                    <span className="text-green-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Result</span>
                  </>
                )}
              </button>
            )}
          </div>
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand to-primary rounded-xl blur opacity-5 transition duration-500"></div>
            <div className="relative h-full bg-slate-950/5 dark:bg-slate-900/50 border border-border rounded-xl shadow-inner flex flex-col overflow-hidden">
              <pre className="flex-1 p-4 font-mono text-sm overflow-auto text-foreground selection:bg-primary/30">
                {output || <span className="text-muted-foreground/50 italic">Waiting for input...</span>}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
