import { 
  Key, 
  Code, 
  Binary, 
  Repeat, 
  Clock, 
  Terminal, 
  Database, 
  FileType, 
  ShieldCheck,
  History,
  Settings,
  type LucideIcon
} from 'lucide-react';
import { useStore, type ToolType } from '../store';
import { clsx } from 'clsx';

interface ToolItem {
  id: ToolType;
  label: string;
  icon: LucideIcon;
  color: string;
}

const TOOLS: ToolItem[] = [
  { id: 'jwt-decoder', label: 'JWT Decoder', icon: Key, color: 'text-purple-500' },
  { id: 'json-formatter', label: 'JSON Formatter', icon: Code, color: 'text-blue-500' },
  { id: 'base64', label: 'Base64 Converter', icon: Binary, color: 'text-emerald-500' },
  { id: 'regex-tester', label: 'Regex Tester', icon: Repeat, color: 'text-pink-500' },
  { id: 'timestamp', label: 'Unix Timestamp', icon: Clock, color: 'text-orange-500' },
  { id: 'curl-converter', label: 'cURL Converter', icon: Terminal, color: 'text-cyan-500' },
  { id: 'sql-formatter', label: 'SQL Formatter', icon: Database, color: 'text-indigo-500' },
  { id: 'yaml-json', label: 'YAML ↔ JSON', icon: FileType, color: 'text-yellow-600' },
  { id: 'hash-generator', label: 'Hash Generator', icon: ShieldCheck, color: 'text-red-500' },
];

export function Sidebar() {
  const { activeTool, setActiveTool } = useStore();

  return (
    <aside className="w-64 border-r border-border h-[calc(100vh-64px)] overflow-y-auto bg-background/50 flex flex-col hide-scrollbar">
      <div className="p-4 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            Development Tools
          </h3>
          <nav className="space-y-1">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className={clsx(
                  "w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-all group",
                  activeTool === tool.id 
                    ? "bg-primary/10 text-primary" 
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                <tool.icon className={clsx(
                  "w-4 h-4",
                  activeTool === tool.id ? tool.color : "group-hover:text-foreground transition-colors"
                )} />
                <span>{tool.label}</span>
                {activeTool === tool.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-border">
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-2">
            Session
          </h3>
          <nav className="space-y-1">
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
              <History className="w-4 h-4" />
              <span>Recent History</span>
            </button>
            <button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-all">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </button>
          </nav>
        </div>
      </div>

      <div className="mt-auto p-4 border-t border-border">
        <div className="bg-muted/50 rounded-xl p-3">
          <p className="text-[10px] text-muted-foreground text-center uppercase tracking-widest font-bold">
            All tools run client-side
          </p>
        </div>
      </div>
    </aside>
  );
}
