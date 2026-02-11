# AI UI Generator

Convert natural language to working UI code using a deterministic component library.

## Quick Start

1. Install dependencies:
```bash
npm install
```

2. Set up your Gemini API key:
```bash
cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
```

3. Run development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import project in Vercel
3. Add `GEMINI_API_KEY` environment variable
4. Deploy

### Other Platforms

Set the `GEMINI_API_KEY` environment variable and run:
```bash
npm run build
npm start
```

## Documentation

See [README.md](README.md) for full documentation.

## Features

- ✅ 3-agent AI system (Planner → Generator → Explainer)
- ✅ Deterministic component library (8 fixed components)
- ✅ Incremental code modification (no full rewrites)
- ✅ Live preview with error handling
- ✅ Version history and rollback
- ✅ AI decision explanations

## Assignment Requirements

This project fulfills all requirements of the Ryze AI Full-Stack Assignment:
- Multi-step AI agent architecture
- Fixed component system with no customization
- 3-panel Claude-style UI
- Iterative modification support
- Version rollback functionality
- Comprehensive documentation
