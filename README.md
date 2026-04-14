# Developer Tool Hub

A collection of developer utilities built with React, TypeScript, and Tailwind CSS. All tools run entirely client-side, ensuring your data never leaves your browser.

## 🚀 Key Features

The hub includes 9 essential developer tools, each designed with a focus on speed, aesthetics, and usability:

- **JWT Decoder**: Decode and inspect JSON Web Tokens instantly.
- **JSON Formatter**: Prettify, minify, and validate JSON data.
- **Base64 Converter**: Robust bidirectional encoding/decoding with UTF-8 support.
- **Unix Timestamp**: Convert between epoch intervals and human-readable dates.
- **Hash Generator**: Generate MD5, SHA-1, SHA-256, and SHA-512 hashes.
- **SQL Formatter**: Standardize queries across multiple SQL dialects.
- **YAML ↔ JSON**: Seamless bidirectional conversion between YAML and JSON.
- **Regex Tester**: Interactive regular expression testing with real-time match highlighting.
- **cURL Converter**: Parse complex cURL commands into structured, readable HTTP requests.

## 🛠 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Bundler**: Vite
- **State Management**: Zustand (with persistent storage)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React

## 📦 Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

### Production Build
The project is configured to output production builds directly into the `public/` directory for deployment ease.
```bash
npm run build
```

## 🏗 Project Structure

- `src/components/tools/`: Individual tool implementations.
- `src/store.ts`: Global state management for theme and tool navigation.
- `static/`: Source directory for static assets (favicon, icons, etc.).
- `public/`: Destination directory for production build artifacts.

## 🔒 Privacy & Security
Everything runs in the browser. No data is sent to any server. Your sensitive payloads (JWTs, JSON, SQL) stay in your local environment.

---


