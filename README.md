# AI UI Generator - Deterministic Component System

A Next.js application that converts natural language descriptions into working React UI code using AI. The system features step-by-step planning, deterministic component rendering, and version control with rollback capabilities—all powered by a three-agent architecture.

## 📖 What This App Does

This UI generator takes your text prompts (like "create a login form" or "add a data table") and automatically generates React code using a fixed library of 11 pre-built components. Unlike traditional AI code generators that create custom components, this system ensures **deterministic rendering**—the same input always produces the same output by constraining AI to select and compose from a whitelist of frozen components.

**Key Capabilities:**
- ✅ Natural language to UI code generation
- ✅ Live preview with instant feedback
- ✅ Step-by-step planning visualization
- ✅ Version history with rollback and delete
- ✅ AI explanations of design decisions
- ✅ Offline persistence using localStorage

---

## 🚀 Installation

### Prerequisites

Before you begin, ensure you have:
- **Node.js 18+** installed on your system
- **Groq API key** (get one free at [Groq Console](https://console.groq.com/))

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/Lakshmiprasanthg/RyzeAI.git
   cd RyzeAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Create a `.env.local` file in the root directory:
   ```bash
   GROQ_API_KEY=your_groq_api_key_here
   ```
   
   **⚠️ Security Note:**
   - `.env.local` is automatically ignored by git (never committed)
   - Never commit API keys to version control
   - For deployment (Vercel/Netlify), add `GROQ_API_KEY` to environment variables in dashboard
   - Get a free Groq API key at: https://console.groq.com/

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

The application should now be running with a 4-panel interface: Chat, Planner, Code Editor, and Live Preview.

---

## ✨ Features

### 1. **Three-Agent Architecture**

The system orchestrates three specialized AI agents that work in sequence:

- **Planner Agent** - Interprets user intent and generates a tree-based JSON layout structure
  - Analyzes natural language input
  - Selects appropriate components from the whitelist
  - Creates hierarchical layout tree (not flat component list)
  - Outputs pure JSON structure

- **Generator Agent** - Pure deterministic tree renderer (NO AI)
  - Recursively traverses the layout tree
  - Converts tree nodes to React JSX string
  - 100% deterministic: same tree = same code every time
  - No LLM calls - pure JavaScript function

- **Explainer Agent** - Documents design decisions in plain English
  - Explains component choices
  - Describes layout rationale
  - Details prop selections
  - Provides UX reasoning

### 2. **Fixed Component Library (11 Components)**

All UIs are built from a frozen component set with predetermined styling:

**UI Components (8):**
- `Button` - Primary, secondary, outline, danger variants with multiple sizes
- `Card` - Default, bordered, elevated styles
- `Input` - Text, email, password, number types with validation states
- `Table` - Data tables with striped rows and hover effects
- `Modal` - Dismissible overlays (sm, md, lg, xl sizes)
- `Sidebar` - Navigation sidebars with configurable width
- `Navbar` - Top navigation bars (light/dark themes)
- `Chart` - Bar, line, pie charts using Recharts

**Layout Components (3):**
- `Stack` - Vertical/horizontal flexbox stacking
- `Center` - Centers content with max-width constraints
- `Container` - Responsive padding wrapper

**Key Constraints:**
- ❌ NO custom components created by AI
- ❌ NO inline styles or dynamic Tailwind classes
- ❌ NO event handlers (onClick, onChange, etc.) in generated code
- ✅ Only allowed props from component schemas

### 3. **Version Control & Management**

Complete version history with localStorage persistence:

- **Automatic Snapshots** - Every generation creates a new version
- **Instant Rollback** - Click any previous version to restore it (removes all versions after that point)
- **Individual Delete** - Remove unwanted versions with the 🗑️ button
- **Offline Persistence** - All versions saved to localStorage, survives page refresh
- **Fresh Start on Reload** - Page loads empty, but version history preserved for rollback

### 4. **Live Preview Sandbox**

Real-time rendering of generated code:
- Components imported dynamically from `components/ui/`
- Props validated before rendering
- Error boundaries prevent crashes
- Safe evaluation environment

### 5. **4-Panel Interface**

- **Chat Panel (Left)** - Natural language input with message history
- **Planner Panel** - Visualizes the tree structure output from Planner
- **Code Editor (Center)** - Monaco editor showing generated React code
- **Preview Panel (Right)** - Live rendering + AI explanations below

---

## 📖 Usage Instructions

### Basic Workflow

1. **Enter Your Intent**
   
   Type a description in the chat panel:
   ```
   "Create a user profile card with name, email, and avatar"
   ```

2. **Watch the Agents Work**
   
   - Planner generates JSON tree structure (visible in Planner panel)
   - Generator converts tree to React code (visible in Code panel)
   - Explainer provides reasoning (visible below Preview panel)

3. **View Results**
   
   - Generated code appears in the Code Editor
   - Live preview renders on the right
   - Version automatically saved to history

4. **Make Modifications**
   
   Type follow-up requests:
   ```
   "Add a logout button at the bottom"
   ```
   
   The system modifies existing code rather than regenerating everything.

### Version Control Operations

**Rollback to Previous Version:**
1. Expand Version History panel at bottom-left
2. Find the version you want
3. Click the ↩ rollback button
4. All versions after that point are removed

**Delete Unwanted Versions:**
1. Open Version History panel
2. Click the 🗑️ button on any version
3. Confirm deletion
4. Version removed from localStorage

**Current Version Indicator:**
- The active version shows a blue "Current" badge
- Deleting the current version resets the preview to empty

### Example Prompts

**Dashboard Layout:**
```
Create a dashboard with a navbar, sidebar, and main content area containing stat cards
```

**Data Table:**
```
Build a user management table with columns for name, email, role, and status
```

**Form:**
```
Make a contact form with name, email, message fields and a submit button
```

**Modifications:**
```
Change the button to danger variant and add spacing between inputs
```

---

## 🏗️ Architecture

### System Design Overview

The application follows a **three-agent pipeline** where each agent has a specific, focused responsibility:

```
User Input → Planner (AI) → Generator (Deterministic) → Explainer (AI) → UI Output
                ↓
         layoutTree JSON
```

### Agent Flow Explained

**1. Planner Agent (AI-Powered)**

Location: `lib/agents/planner.ts`

- **Input**: User's natural language intent
- **Processing**: Uses Groq API (model: `openai/gpt-oss-20b`) with strict system instructions
- **Output**: JSON object with tree structure

```json
{
  "intent": "Create a login form",
  "layoutTree": {
    "type": "Card",
    "props": { "variant": "default" },
    "children": [
      {
        "type": "Input",
        "props": { "type": "email", "placeholder": "Email" }
      },
      {
        "type": "Input",
        "props": { "type": "password", "placeholder": "Password" }
      },
      {
        "type": "Button",
        "props": { "variant": "primary", "children": "Login" }
      }
    ]
  }
}
```

- **Key Feature**: Outputs hierarchical tree (NOT flat component list)
- **Validation**: Checks component whitelist and prop schemas
- **Constraints**: Cannot use event handlers, must follow tree structure rules

**2. Generator Agent (Pure Deterministic Renderer)**

Location: `lib/agents/generator.ts`

- **Input**: layoutTree JSON from Planner
- **Processing**: Pure recursive JavaScript function - NO AI/LLM calls
- **Output**: React JSX string

```javascript
function renderNode(node) {
  const { type, props, children } = node;
  const propsJSX = propsToJSX(props);
  const childrenJSX = children?.map(renderNode).join('\\n');
  return `<${type}${propsJSX}>${childrenJSX}</${type}>`;
}
```

- **Determinism**: Same tree input ALWAYS produces identical code output
- **Speed**: Executes in milliseconds (no API latency)
- **Reliability**: No AI hallucinations or inconsistencies

**3. Explainer Agent (AI-Powered)**

Location: `lib/agents/explainer.ts`

- **Input**: Planner output + Generator code
- **Processing**: Uses Groq API to analyze decisions
- **Output**: Natural language explanation

```json
{
  "summary": "Created a login form with email/password inputs",
  "decisions": [
    {
      "decision": "Used Card component as container",
      "reasoning": "Provides visual grouping and elevation"
    }
  ],
  "componentsUsed": ["Card", "Input", "Button"]
}
```

### Technical Stack

- **Framework**: Next.js 15.1.3 with App Router
- **Language**: TypeScript (strict mode)
- **UI Library**: React 18
- **Styling**: Tailwind CSS 3.4+ (fixed classes only)
- **AI Provider**: Groq API with `openai/gpt-oss-20b` model
- **Code Editor**: Monaco Editor (VS Code's editor)
- **Charts**: Recharts library
- **State Management**: React hooks + localStorage

### Project Structure

```
RyzeAI/
├── app/
│   ├── api/
│   │   └── generate/route.ts      # Main generation endpoint
│   ├── page.tsx                    # Main UI (4-panel layout)
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── ui/                         # Fixed component library (11 components)
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   ├── Chart.tsx
│   │   ├── Stack.tsx
│   │   ├── Center.tsx
│   │   └── Container.tsx
│   ├── ChatPanel.tsx               # User input interface
│   ├── CodeEditor.tsx              # Monaco code editor
│   ├── PreviewSandbox.tsx          # Live preview renderer
│   ├── ExplanationPanel.tsx        # AI explanations display
│   ├── PlannerPanel.tsx            # Tree structure visualization
│   └── VersionHistory.tsx          # Version management UI
├── lib/
│   ├── agents/
│   │   ├── planner.ts              # Planner agent (AI)
│   │   ├── generator.ts            # Generator agent (deterministic)
│   │   └── explainer.ts            # Explainer agent (AI)
│   ├── validators/
│   │   └── component-validator.ts  # Whitelist enforcement
│   ├── groq-client.ts              # Groq API integration
│   └── component-whitelist.ts      # Component schemas
└── package.json
```

### Data Flow

1. **User types prompt** in ChatPanel
2. **Frontend sends POST** to `/api/generate` with user intent
3. **API route calls Planner** → receives layoutTree JSON
4. **API calls Generator** → receives React JSX code
5. **API calls Explainer** → receives decision reasoning
6. **Frontend receives response** with plan, code, and explanation
7. **Creates StoredVersion** object with unique ID and timestamp
8. **Saves to localStorage** under key `ryzeai-versions`
9. **Updates UI state** to display code, preview, and explanations
10. **Adds to version history** for rollback/delete operations

---

## 💾 Versioning Logic

### Storage Architecture

The application uses **browser localStorage** for version persistence instead of a backend database. This design choice provides several advantages:

**Why localStorage?**
- ✅ **Zero server dependencies** - Works offline, no database needed
- ✅ **Instant operations** - No network latency for save/load/delete
- ✅ **User privacy** - Data stays in browser, never sent to server
- ✅ **Simple deployment** - No database setup or migrations required
- ✅ **Perfect for prototypes** - Fast iteration during development

**Trade-offs:**
- ⚠️ Data is per-browser (not synced across devices)
- ⚠️ Limited to ~5-10MB storage (plenty for this use case)
- ⚠️ Cleared when user clears browser data

### Version Data Structure

Each version is stored as a JSON object:

```typescript
interface StoredVersion {
  id: string;              // Unique ID (timestamp-based)
  timestamp: number;       // Unix timestamp in milliseconds
  userIntent: string;      // Original prompt from user
  plan: PlannerOutput;     // JSON tree structure from Planner
  code: string;            // Generated React code
  explanation?: ExplanationOutput;  // AI reasoning
}
```

### Storage Operations

**Save New Version:**
```javascript
// Create version object
const newVersion = {
  id: `version-${Date.now()}`,
  timestamp: Date.now(),
  userIntent: "Create a login form",
  plan: plannerOutput,
  code: generatedCode,
  explanation: explanationOutput
};

// Add to history array
setVersionHistory(prev => [...prev, newVersion]);

// Automatically saved to localStorage via useEffect
useEffect(() => {
  if (versionHistory.length > 0) {
    localStorage.setItem('ryzeai-versions', JSON.stringify(versionHistory));
  }
}, [versionHistory]);
```

**Load Versions on Startup:**
```javascript
useEffect(() => {
  const saved = localStorage.getItem('ryzeai-versions');
  if (saved) {
    const versions = JSON.parse(saved);
    setVersionHistory(versions);
    // Note: Does NOT auto-load latest version (fresh start on reload)
  }
}, []);
```

**Rollback to Version:**
```javascript
const handleRollback = (versionId: string) => {
  const version = versionHistory.find(v => v.id === versionId);
  
  // Remove all versions after this one
  const index = versionHistory.findIndex(v => v.id === versionId);
  const newHistory = versionHistory.slice(0, index + 1);
  
  setVersionHistory(newHistory);  // Triggers localStorage save
  setCurrentCode(version.code);
  setCurrentPlan(version.plan);
  setCurrentVersionId(version.id);
};
```

**Delete Specific Version:**
```javascript
const handleDeleteVersion = (versionId: string) => {
  // Filter out deleted version
  const newHistory = versionHistory.filter(v => v.id !== versionId);
  setVersionHistory(newHistory);  // Triggers localStorage save
  
  // Reset current state if we deleted active version
  if (versionId === currentVersionId) {
    setCurrentCode('');
    setCurrentPlan(undefined);
    setCurrentVersionId(undefined);
  }
};
```

### Reliability Features

1. **Automatic Persistence** - Every state change triggers localStorage save
2. **Error Recovery** - Try-catch blocks handle corrupted data gracefully
3. **Fresh Start Policy** - Page reload shows empty preview, but history preserved
4. **Instant Updates** - UI reflects changes immediately (synchronous operations)

### Future Considerations

For production deployment with multiple users:
- Migrate to **PostgreSQL** or **MongoDB** for persistent storage
- Add **user authentication** to separate version histories
- Implement **cloud sync** for cross-device access
- Add **export/import** functionality for backup
- Consider **compression** for large version histories

---

## 🔮 Future Improvements

### High Priority

**Persistent Backend Storage**
- Replace localStorage with PostgreSQL or MongoDB
- Add user authentication and multi-user support
- Enable cross-device synchronization
- Implement session management

**Streaming Responses**
- Stream AI output token-by-token as it generates
- Show real-time progress indicators
- Improve perceived performance

**Enhanced Component Library**
- Add more components: Form, Tabs, Accordion, Dropdown, Badge
- Support component variants and themes
- Enable responsive prop configurations

**Diff Visualization**
- Side-by-side comparison of version changes
- Syntax-highlighted diffs
- Visual change indicators in editor

### Medium Priority

**Code Export & Import**
- Download generated code as `.tsx` files
- Export entire project as zip
- Import existing code for modification
- Git integration for version control

**Better Error Handling**
- More descriptive error messages
- Automatic retry with exponential backoff
- Fallback strategies when AI fails
- Error recovery suggestions

**Performance Optimization**
- Memoization of expensive computations
- Code generation caching
- Lazy loading of components
- Virtual scrolling for long version lists

**Accessibility Improvements**
- Keyboard navigation support
- Screen reader compatibility
- ARIA labels on all interactive elements
- Focus management

### Nice to Have

**Collaborative Features**
- Real-time multi-user editing
- Shared version history
- Comments and annotations
- Team workspaces

**Component Preview Gallery**
- Browse all available components
- See props and variants
- Copy-paste examples
- Interactive playground

**Theme Customization**
- User-defined color schemes (still deterministic)
- Dark/light mode for generated UIs
- Custom font selections
- Preset theme library

**Mobile Responsiveness**
- Mobile-optimized editor interface
- Touch-friendly controls
- Responsive preview modes (phone/tablet/desktop)
- PWA support for offline use

**Testing & Quality**
- Automated accessibility audits
- Visual regression testing
- Component unit tests
- End-to-end testing

---

## 📝 License

MIT License

Copyright (c) 2026 Lakshmiprasanth G

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

## 👤 Author

**Lakshmiprasanth G**

GitHub: [@Lakshmiprasanthg](https://github.com/Lakshmiprasanthg)
Repository: [RyzeAI](https://github.com/Lakshmiprasanthg/RyzeAI)

---

## 🎓 Project Context

This project was developed as part of the **Ryze AI Full-Stack Assignment** to demonstrate:
- Multi-agent AI system design
- Deterministic code generation
- Version control implementation
- Full-stack development skills
- Engineering judgment and decision-making

**Submission Date**: February 2026

---

## 🙏 Acknowledgments

- **Groq** for providing fast AI inference API
- **Next.js** team for the excellent React framework
- **Tailwind CSS** for utility-first styling
- **Monaco Editor** for the embedded code editor
- **Recharts** for data visualization components

---

**⚡ Built with Next.js, TypeScript, Groq AI, and localStorage**
