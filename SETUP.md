# 🚀 Quick Setup Guide

## Prerequisites

- Node.js 18 or higher
- npm (comes with Node.js)
- Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

## Installation Steps

### Option 1: Automated Setup (Windows)

1. Run the setup script:
```bash
setup.bat
```

2. Edit `.env` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Option 2: Manual Setup

1. **Install dependencies:**
```bash
npm install
```

2. **Create environment file:**
```bash
cp .env.example .env
```

3. **Add your API key to `.env`:**
```
GEMINI_API_KEY=your_gemini_api_key_here
```

4. **Start development server:**
```bash
npm run dev
```

5. **Open in browser:**
```
http://localhost:3000
```

## Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the key and paste it into your `.env` file

## Verify Installation

After starting the server, you should see:
- ✅ App running at http://localhost:3000
- ✅ Three-panel layout (Chat | Code | Preview)
- ✅ Welcome message in chat panel

## Troubleshooting

### "GEMINI_API_KEY is not set" error

Make sure you:
1. Created the `.env` file
2. Added `GEMINI_API_KEY=your_key`
3. Restarted the development server

### Port 3000 already in use

Change the port:
```bash
npm run dev -- -p 3001
```

### Module not found errors

Reinstall dependencies:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Next Steps

Once running:

1. **Try a simple UI:**
   - Type: "Create a login form with email and password"
   - Watch the AI generate the code and preview

2. **Modify it:**
   - Type: "Add a forgot password link"
   - See incremental modification in action

3. **Explore features:**
   - View AI explanations
   - Check version history
   - Try rollback functionality

## Building for Production

```bash
npm run build
npm start
```

## Deployment

See [DEPLOYMENT.md](DEPLOYMENT.md) for deployment instructions.

## Need Help?

- Check [README.md](README.md) for full documentation
- Review assignment requirements in `_Ryze AI Full Stack.txt`
- Check console for error messages
