import { useState, useCallback } from 'react';
import { useStore } from '../../store';
import { ToolCard } from '../ToolCard';
import { Database, Settings2 } from 'lucide-react';
import { format, type FormatOptions } from 'sql-formatter';

type Dialect = 'sql' | 'mysql' | 'postgresql' | 'sqlite' | 'mariadb';

export function SQLFormatter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [dialect, setDialect] = useState<Dialect>('sql');
  const [error, setError] = useState<string | null>(null);
  const addHistory = useStore((state) => state.addHistory);

  const formatSQL = useCallback((val: string, currentDialect: Dialect) => {
    if (!val.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      const result = format(val, {
        language: currentDialect,
        indentStyle: 'tabularLeft',
        uppercase: true,
        keywordCase: 'upper'
      } as unknown as FormatOptions);
      
      setOutput(result);
      setError(null);
      addHistory('sql-formatter', val, result);
    } catch (err: any) {
      setError(err.message);
      setOutput('');
    }
  }, [addHistory]);

  const handleInputChange = (val: string) => {
    setInput(val);
    formatSQL(val, dialect);
  };

  const handleDialectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newDialect = e.target.value as Dialect;
    setDialect(newDialect);
    formatSQL(input, newDialect);
  };

  return (
    <ToolCard 
      title="SQL Formatter" 
      description="Beautify and standardize your SQL queries with dialect-specific formatting."
      output={output || (error ? `Error: ${error}` : '')}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-2 border-b border-border bg-muted/30">
          <div className="flex items-center space-x-2 px-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
            <Database className="w-3.5 h-3.5" />
            <span>Query Input</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 px-2 py-1 bg-background border border-border rounded text-[10px] font-bold text-muted-foreground uppercase">
              <Settings2 className="w-3 h-3" />
              <span>Dialect</span>
            </div>
            <select
              value={dialect}
              onChange={handleDialectChange}
              className="px-2 py-1 text-xs rounded border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="sql">Standard SQL</option>
              <option value="mysql">MySQL</option>
              <option value="postgresql">PostgreSQL</option>
              <option value="sqlite">SQLite</option>
              <option value="mariadb">MariaDB</option>
            </select>
          </div>
        </div>
        <div className="flex-1 flex flex-col min-h-0">
          <textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="SELECT * FROM users WHERE status = 'active'..."
            className="flex-1 w-full p-4 font-mono text-sm bg-transparent border-none focus:outline-none resize-none hide-scrollbar selection:bg-primary/20"
            spellCheck={false}
          />
        </div>
      </div>
    </ToolCard>
  );
}
