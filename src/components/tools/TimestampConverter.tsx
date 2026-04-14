import { useState, useEffect, useCallback } from 'react';
import { useStore } from '../../store';
import { ToolCard } from '../ToolCard';
import { Clock, Calendar, RefreshCw, AlertCircle } from 'lucide-react';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(relativeTime);
dayjs.extend(utc);
dayjs.extend(timezone);

export function TimestampConverter() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [currentTime, setCurrentTime] = useState(dayjs());
  const [error, setError] = useState<string | null>(null);
  const addHistory = useStore((state) => state.addHistory);

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(dayjs()), 1000);
    return () => clearInterval(timer);
  }, []);

  const convert = useCallback((val: string) => {
    if (!val.trim()) {
      setOutput('');
      setError(null);
      return;
    }

    try {
      let date;
      // Check if input is a number (timestamp)
      if (/^\d+$/.test(val)) {
        const ts = parseInt(val);
        // Detect if it's seconds or milliseconds
        date = ts > 9999999999 ? dayjs(ts) : dayjs.unix(ts);
      } else {
        date = dayjs(val);
      }

      if (!date.isValid()) {
        throw new Error('Invalid Date/Timestamp');
      }

      const result = [
        `ISO 8601: ${date.toISOString()}`,
        `Relative: ${date.fromNow()}`,
        `Local:    ${date.format('YYYY-MM-DD HH:mm:ss')}`,
        `UTC:      ${date.utc().format('YYYY-MM-DD HH:mm:ss')}`,
        `Unix (s): ${date.unix()}`,
        `Unix (ms): ${date.valueOf()}`,
        `Timezone: ${dayjs.tz.guess()}`
      ].join('\n');

      setOutput(result);
      setError(null);
      addHistory('timestamp', val, result);
    } catch (err: any) {
      setError(err.message);
      setOutput('');
    }
  }, [addHistory]);

  const handleInputChange = (val: string) => {
    setInput(val);
    convert(val);
  };

  const useCurrentTime = () => {
    const ts = Math.floor(Date.now() / 1000).toString();
    setInput(ts);
    convert(ts);
  };

  return (
    <ToolCard 
      title="Timestamp Converter" 
      description="Convert Unix timestamps to human-readable dates and vice versa."
      output={output || (error ? `Error: ${error}` : '')}
    >
      <div className="flex flex-col h-full">
        {/* Real-time Header */}
        <div className="flex items-center justify-between p-3 bg-primary/5 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="p-1.5 bg-primary/10 rounded-lg">
              <Clock className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider">Current Unix Epoch</p>
              <p className="text-sm font-mono font-bold text-foreground">
                {Math.floor(currentTime.valueOf() / 1000)}
              </p>
            </div>
          </div>
          <button
            onClick={useCurrentTime}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-primary text-white text-xs font-bold hover:opacity-90 transition-all shadow-sm"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Use Current</span>
          </button>
        </div>

        <div className="flex flex-col p-4 space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-1">
              Input Date or Timestamp
            </label>
            <div className="relative group">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <input
                type="text"
                value={input}
                onChange={(e) => handleInputChange(e.target.value)}
                placeholder="e.g. 1713043200 or 2024-04-13"
                className="w-full pl-10 pr-4 py-3 bg-muted/30 border border-border rounded-xl font-mono text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-muted/20 border border-border/50 flex items-start space-x-3">
            <div className="p-1.5 bg-background rounded-lg border border-border">
              <Clock className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="text-xs font-semibold text-foreground">Pro Tip</p>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                We automatically detect if a timestamp is in seconds or milliseconds based on its length. You can also paste ISO 8601 strings.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-auto p-4 flex items-center space-x-2 text-destructive">
            <AlertCircle className="w-4 h-4" />
            <p className="text-xs font-semibold">Invalid format</p>
          </div>
        )}
      </div>
    </ToolCard>
  );
}
