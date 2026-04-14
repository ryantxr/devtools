import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ToolType =
  | 'jwt-decoder'
  | 'json-formatter'
  | 'base64'
  | 'regex-tester'
  | 'timestamp'
  | 'curl-converter'
  | 'sql-formatter'
  | 'yaml-json'
  | 'hash-generator';

interface HistoryItem {
  id: string;
  tool: ToolType;
  input: string;
  output: string;
  timestamp: number;
}

interface ToolState {
  darkMode: boolean;
  activeTool: ToolType;
  history: HistoryItem[];
  toggleDarkMode: () => void;
  setActiveTool: (tool: ToolType) => void;
  addHistory: (tool: ToolType, input: string, output: string) => void;
  clearHistory: () => void;
}

export const useStore = create<ToolState>()(
  persist(
    (set) => ({
      darkMode: true,
      activeTool: 'json-formatter',
      history: [],
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      setActiveTool: (tool) => set({ activeTool: tool }),
      addHistory: (tool, input, output) =>
        set((state) => ({
          history: [
            {
              id: Math.random().toString(36).substring(2, 9),
              tool,
              input,
              output,
              timestamp: Date.now(),
            },
            ...state.history,
          ].slice(0, 50),
        })),
      clearHistory: () => set({ history: [] }),
    }),
    {
      name: 'tool-hub-storage',
    }
  )
);
