# Developer Tool Hub – Quick Development Reference

## Tech Stack
- **Frontend:** React + TypeScript + Vite + Tailwind
- **State:** Zustand
- **Tools:** All client-side (instant feedback)

## Project Setup (5 minutes)

```bash
# Create project
npm create vite@latest dev-tools -- --template react-ts
cd dev-tools

# Install dependencies
npm install
npm install zustand tailwindcss postcss autoprefixer

# Setup Tailwind
npx tailwindcss init -p

# Start dev server
npm run dev
```

## File Structure

```
src/
├── components/
│   ├── Sidebar.tsx          # Navigation between tools
│   ├── ToolCard.tsx         # Reusable tool wrapper
│   ├── Header.tsx           # Top bar with title/theme toggle
│   └── tools/
│       ├── JWTDecoder.tsx
│       ├── JSONFormatter.tsx
│       ├── Base64Converter.tsx
│       ├── RegexTester.tsx
│       ├── TimestampConverter.tsx
│       ├── CurlConverter.tsx
│       ├── SQLFormatter.tsx
│       ├── YAMLJSONConverter.tsx
│       └── HashGenerator.tsx
├── hooks/
│   └── useToolState.ts      # Shared state logic
├── utils/
│   ├── clipboard.ts         # Copy-to-clipboard helper
│   └── validators.ts        # Input validation
├── store.ts                 # Zustand state management
├── App.tsx
└── index.css
```

## Core Components

### 1. Store Setup (store.ts)
```typescript
import create from 'zustand';

interface ToolState {
  darkMode: boolean;
  history: Array<{ tool: string; input: string; output: string; timestamp: Date }>;
  toggleDarkMode: () => void;
  addHistory: (tool: string, input: string, output: string) => void;
}

export const useStore = create<ToolState>((set) => ({
  darkMode: true,
  history: [],
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
  addHistory: (tool, input, output) =>
    set((state) => ({
      history: [{ tool, input, output, timestamp: new Date() }, ...state.history].slice(0, 50),
    })),
}));
```

### 2. ToolCard Component (reusable wrapper)
```typescript
interface ToolCardProps {
  title: string;
  children: React.ReactNode;
}

export function ToolCard({ title, children }: ToolCardProps) {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-2 gap-4">
        {children}
      </div>
    </div>
  );
}
```

### 3. Example Tool: JWT Decoder
```typescript
import { useState } from 'react';
import { ToolCard } from '../ToolCard';

export function JWTDecoder() {
  const [jwt, setJwt] = useState('');
  const [decoded, setDecoded] = useState<any>(null);

  const handleDecode = (value: string) => {
    setJwt(value);
    try {
      const parts = value.split('.');
      if (parts.length !== 3) throw new Error('Invalid JWT');
      
      const payload = JSON.parse(atob(parts[1]));
      setDecoded(payload);
    } catch (err) {
      setDecoded({ error: err instanceof Error ? err.message : 'Invalid JWT' });
    }
  };

  return (
    <ToolCard title="JWT Decoder">
      <textarea
        value={jwt}
        onChange={(e) => handleDecode(e.target.value)}
        placeholder="Paste JWT here..."
        className="w-full p-3 border rounded bg-white dark:bg-gray-800"
      />
      <pre className="p-3 bg-gray-100 dark:bg-gray-900 rounded overflow-auto">
        {JSON.stringify(decoded, null, 2)}
      </pre>
    </ToolCard>
  );
}
```

## Build Order (Start with These)

**Week 1 - Core Tools (No Dependencies)**
1. ✅ JSON Formatter
2. ✅ Base64 Encode/Decode
3. ✅ Timestamp Converter
4. ✅ JWT Decoder
5. ✅ Hash Generator

**Week 2 - Medium Tools (External Packages)**
6. ✅ YAML ↔ JSON (use `js-yaml`)
7. ✅ SQL Formatter (use `sql-formatter`)
8. ✅ Regex Tester

**Week 3 - Complex Tools**
9. ✅ cURL Converter

## Key Features to Add Incrementally

### Phase 1 (MVP - Week 1)
- [ ] Tool navigation (sidebar)
- [ ] Dark mode toggle
- [ ] Copy-to-clipboard buttons
- [ ] Live input/output preview
- [ ] Error handling

### Phase 2 (Polish - Week 2)
- [ ] History panel (recent 10 conversions)
- [ ] Keyboard shortcuts (Cmd+K for search)
- [ ] Mobile responsive design
- [ ] Input validation with helpful errors
- [ ] Theme persistence (localStorage)

### Phase 3+ (Future)
- [ ] Shareable URLs for conversions
- [ ] Analytics (which tools are most popular?)
- [ ] Export conversions as JSON/PDF
- [ ] Offline support (service worker)

## Common Patterns

### Copy to Clipboard
```typescript
const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    // Show toast notification
  } catch (err) {
    console.error('Failed to copy:', err);
  }
};
```

### Input Validation
```typescript
const validateJSON = (text: string): boolean => {
  try {
    JSON.parse(text);
    return true;
  } catch {
    return false;
  }
};
```

### Live Preview Pattern
```typescript
const [input, setInput] = useState('');
const [output, setOutput] = useState('');

const handleChange = (value: string) => {
  setInput(value);
  try {
    setOutput(transform(value)); // Your transformation function
  } catch (err) {
    setOutput(`Error: ${err.message}`);
  }
};
```

## Performance Tips

1. **Memoize components** if they don't change often
   ```typescript
   export const JWTDecoder = memo(function JWTDecoder() { ... });
   ```

2. **Lazy load tools** (load only when user navigates to them)
   ```typescript
   const JWTDecoder = lazy(() => import('./tools/JWTDecoder'));
   ```

3. **Debounce input** for slow operations
   ```typescript
   const debouncedTransform = useMemo(
     () => debounce(transform, 300),
     []
   );
   ```

## Dependencies Reference

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "vite": "^5.0.0",
  "typescript": "^5.0.0",
  "zustand": "^4.4.0",
  "tailwindcss": "^3.4.0",
  "postcss": "^8.4.0",
  "autoprefixer": "^10.4.0",
  "js-yaml": "^4.1.0",
  "sql-formatter": "^13.1.0",
  "day.js": "^1.11.10"
}
```

## Development Workflow

```bash
# Start dev server (auto-reload)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Type checking
npx tsc --noEmit
```

## Quick Deployment

When ready:
```bash
npm run build
# Upload dist/ folder to your server
```

That's it! The build output is static HTML/CSS/JS.

## Testing Each Tool Locally

Before deployment, test:
- [ ] Valid inputs produce correct output
- [ ] Invalid inputs show error messages
- [ ] Copy-to-clipboard works
- [ ] Mobile layout works
- [ ] Dark mode works
- [ ] No console errors

## Git Workflow (Recommended)

```bash
git init
git add .
git commit -m "Initial commit: project setup"

# For each tool completed:
git commit -m "Add JWT Decoder tool"
git commit -m "Add JSON Formatter tool"
# etc.
```

---

**Ready to start?** Pick one tool and build it! Recommend starting with **JSON Formatter** (easiest) to get momentum.
