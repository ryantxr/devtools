# Developer Tool Hub – Spec

## Overview
Single-page React app with 9 developer tools in one interface.

## Tools

| # | Tool | Input | Output | Logic |
|---|------|-------|--------|-------|
| 1 | JWT Decoder | JWT string | Decoded header + payload + signature verification status | Base64 decode parts, parse JSON, verify signature if secret provided |
| 2 | JSON Formatter | JSON string | Pretty-printed or minified JSON | Parse JSON, stringify with indent or no indent |
| 3 | Base64 Encoder/Decoder | Text or Base64 | Encoded/decoded result | btoa/atob |
| 4 | Regex Tester | Pattern + test string | Match results with highlighting | RegExp.exec() with global flag, highlight matches |
| 5 | Timestamp Converter | Unix timestamp or date string | Both formats + human-readable | parseInt for unix, new Date() for strings |
| 6 | cURL Converter | cURL command | HTTP method, URL, headers, body | Parse cURL string, extract parts |
| 7 | SQL Formatter | SQL query | Formatted SQL | Use `sql-formatter` package |
| 8 | YAML ↔ JSON | YAML or JSON string | Converted format | Use `js-yaml` package |
| 9 | Hash Generator | Text input | MD5, SHA1, SHA256, SHA512 hashes | Use `crypto-js` package |

## UI Layout

```
┌─────────────────────────────────────────────┐
│ Developer Tools          🌙                 │
├─────────────────┬───────────────────────────┤
│ • JWT Decoder   │                           │
│ • JSON Format   │   Tool Interface          │
│ • Base64        │   (Input/Output)          │
│ • Regex         │                           │
│ • Timestamp     │                           │
│ • cURL          │                           │
│ • SQL Format    │                           │
│ • YAML ↔ JSON   │                           │
│ • Hash Gen      │                           │
└─────────────────┴───────────────────────────┘
```

## Features

### Required
- Tool selector in left sidebar
- Dark mode toggle (top right)
- Input textarea on left, output on right (or stacked on mobile)
- Copy-to-clipboard button on output
- Live preview (no "submit" button needed)
- Error handling (show error message if input is invalid)

### Nice-to-Have
- Keyboard shortcut to focus input (Cmd+K or similar)
- History of last 5 conversions (sidebar dropdown)
- Persistent dark mode preference (localStorage)

## Tech Stack
- React + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- Dependencies: js-yaml, sql-formatter, crypto-js

## Build & Deploy
- `npm run build` outputs static files to `dist/`
- Deploy `dist/` folder to your server
- Server must serve `index.html` for all routes (SPA)

## Acceptance Criteria
- All 9 tools work with valid input
- Invalid input shows helpful error
- Copy button works
- Dark mode toggles and persists
- Mobile responsive
- No console errors
