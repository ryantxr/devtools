import { useState, useCallback } from 'react';
import { useStore } from '../../store';
import { ToolCard } from '../ToolCard';
import { Hash, Copy } from 'lucide-react';
import CryptoJS from 'crypto-js';

export function HashGenerator() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [hashes, setHashes] = useState({
    md5: '',
    sha1: '',
    sha256: '',
    sha512: ''
  });
  const addHistory = useStore((state) => state.addHistory);

  const generateHashes = useCallback((val: string) => {
    if (!val) {
      setHashes({ md5: '', sha1: '', sha256: '', sha512: '' });
      setOutput('');
      return;
    }

    const md5 = CryptoJS.MD5(val).toString();
    const sha1 = CryptoJS.SHA1(val).toString();
    const sha256 = CryptoJS.SHA256(val).toString();
    const sha512 = CryptoJS.SHA512(val).toString();

    const result = { md5, sha1, sha256, sha512 };
    setHashes(result);
    
    const formattedResult = [
      `MD5:    ${md5}`,
      `SHA-1:  ${sha1}`,
      `SHA-256: ${sha256}`,
      `SHA-512: ${sha512}`
    ].join('\n\n');

    setOutput(formattedResult);
    addHistory('hash-generator', val, formattedResult);
  }, [addHistory]);

  const handleInputChange = (val: string) => {
    setInput(val);
    generateHashes(val);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <ToolCard 
      title="Hash Generator" 
      description="Calculate cryptographic hashes for any text input locally in your browser."
      output={output}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Hash className="w-3.5 h-3.5" />
            <span>Input Text</span>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Type or paste text to hash..."
            className="flex-1 w-full p-4 font-mono text-sm bg-transparent border-none focus:outline-none resize-none hide-scrollbar selection:bg-primary/20"
            spellCheck={false}
          />
        </div>

        {/* Individual Hash Previews */}
        {input && (
          <div className="p-4 border-t border-border bg-background grid grid-cols-1 gap-3 animate-in fade-in slide-in-from-bottom-2">
            {Object.entries(hashes).map(([algo, hash]) => (
              <div key={algo} className="group relative">
                <div className="flex items-center justify-between mb-1.5 px-0.5">
                  <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{algo}</span>
                  <button 
                    onClick={() => copyToClipboard(hash)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded text-primary"
                    title={`Copy ${algo.toUpperCase()}`}
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="bg-muted/30 border border-border rounded-lg px-3 py-2 text-[11px] font-mono break-all text-foreground/80">
                  {hash}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolCard>
  );
}
