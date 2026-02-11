# AI UI Generator - Deterministic Component System

An AI-powered agent that converts natural language UI intent into working UI code with live preview, using a fixed, deterministic component library.

## 🎯 Project Overview

This project implements a Claude Code-style UI generator with a critical constraint: **deterministic component rendering**. The AI can only select, compose, and configure components from a fixed library - it cannot create new components or generate custom styles.

## 🏗️ Architecture Overview

### Three-Agent System

The application uses a multi-step AI agent architecture (not a single LLM call):

1. **Planner Agent** (`lib/agents/planner.ts`)
   - Interprets user intent
   - Chooses layout structure
   - Selects appropriate components from the whitelist
   - Outputs a structured JSON plan

2. **Generator Agent** (`lib/agents/generator.ts`)
   - Converts the plan into valid React/TypeScript code
   - Uses ONLY the allowed component library
   - Handles both initial generation and incremental modifications
   - Produces clean, production-ready code

3. **Explainer Agent** (`lib/agents/explainer.ts`)
   - Explains decisions in plain English
   - Documents why specific components were chosen
   - Provides reasoning for layout and prop choices
   - Helps users understand the AI's thinking

### Orchestration

The `orchestrator.ts` coordinates all three agents in sequence:
```
User Intent → Planner → Generator → Validator → Explainer → UI
```

## 🎨 Fixed Component Library

All UIs must use these 8 components with frozen styling:

- **Button** - Primary, secondary, outline, danger variants
- **Card** - Default, bordered, elevated variants
- **Input** - Text, email, password, number inputs
- **Table** - Sortable data tables with striped/hover options
- **Modal** - Dismissible overlays with size variants
- **Sidebar** - Navigation sidebars with configurable width
- **Navbar** - Top navigation bars with light/dark themes
- **Chart** - Bar, line, and pie charts (using Recharts)

See `lib/component-whitelist.ts` for the complete component schema.

### Prohibited

- ❌ Inline styles (`style={{ }}`)
- ❌ AI-generated CSS
- ❌ Arbitrary Tailwind class generation
- ❌ External UI libraries
- ❌ New components created by the AI

## 🔧 Technical Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS (fixed classes only)
- **AI**: Google Gemini 1.5 Pro API
- **Code Editor**: Monaco Editor
- **Charts**: Recharts
- **State Management**: React hooks + in-memory store

## 📦 Project Structure

```
├── app/
│   ├── api/
│   │   ├── generate/      # Initial UI generation
│   │   ├── modify/        # Incremental modifications
│   │   ├── history/       # Version history
│   │   └── rollback/      # Version rollback
│   ├── layout.tsx
│   ├── page.tsx           # Main 3-panel UI
│   └── globals.css
├── components/
│   ├── ui/                # Fixed component library
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── Table.tsx
│   │   ├── Modal.tsx
│   │   ├── Sidebar.tsx
│   │   ├── Navbar.tsx
│   │   └── Chart.tsx
│   ├── ChatPanel.tsx      # User intent input
│   ├── CodeEditor.tsx     # Monaco code editor
│   ├── PreviewSandbox.tsx # Live preview renderer
│   ├── ExplanationPanel.tsx
│   └── VersionHistory.tsx
├── lib/
│   ├── agents/
│   │   ├── planner.ts     # Planner agent
│   │   ├── generator.ts   # Generator agent
│   │   ├── explainer.ts   # Explainer agent
│   │   └── orchestrator.ts # Agent coordination
│   ├── validators/
│   │   └── component-validator.ts
│   ├── gemini-client.ts   # Gemini API integration
│   ├── component-whitelist.ts
│   ├── version-store.ts   # Version management
│   └── code-differ.ts     # Diff detection
└── README.md
```

## 🚀 Setup Instructions

### Prerequisites

- Node.js 18+ installed
- Gemini API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RyzeAI
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and add your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   ```
   http://localhost:3000
   ```

## 💡 Usage Examples

### Initial Generation

**User Input:**
```
Create a login form with email, password, and a submit button
```

**AI Output:**
- Generates a Card with title "Login"
- Input fields for email and password
- Primary Button for submission
- Explains why each component was chosen

### Iterative Modification

**User Input:**
```
Add a "Forgot Password?" link and make it more minimal
```

**AI Output:**
- Modifies existing code (doesn't regenerate)
- Adds a text link below the password field
- Changes Card variant to "default" with less padding
- Explains what changed and why

### Version Rollback

- Click on previous versions in Version History panel
- Instantly rollback to any earlier state
- All versions after rollback point are removed

## 🔐 Safety & Validation

### Component Whitelist Enforcement

Every generated component is validated against the whitelist before rendering:
- Checks for prohibited inline styles
- Validates component names
- Ensures only allowed props are used

### Prompt Injection Protection

User input is sanitized to prevent:
- System instruction manipulation
- Injection attacks
- Malicious prompt patterns

### Error Handling

- Pre-render validation catches issues before display
- Graceful error messages in preview panel
- Detailed error logging for debugging

## 🎯 Agent Design & Prompts

### Planner Agent Prompt

```
You are the Planner Agent in a UI generation system.

CRITICAL CONSTRAINTS:
1. You can ONLY use these components: Button, Card, Input, Table, Modal, Sidebar, Navbar, Chart
2. You CANNOT create new components
3. You CANNOT use external libraries

Output JSON with:
- intent: user's goal
- layout: structure description
- components: array of components with props
- structure: hierarchical arrangement
```

### Generator Agent Prompt

```
You are the Generator Agent.

CRITICAL RULES:
1. Use ONLY the provided component library
2. NO inline styles
3. NO custom CSS generation

For modifications:
- Modify ONLY affected parts
- Preserve unchanged code
- NO full rewrites unless explicitly requested
```

### Explainer Agent Prompt

```
You are the Explainer Agent.

Explain in plain English:
- Why specific components were chosen
- Layout structure reasoning
- Prop choices and their purpose
- Design/UX considerations
```

## 🔄 Incremental Modification Strategy

The system uses **context-aware modification** rather than full regeneration:

1. **Pass existing code** to Generator with modification request
2. **Generator receives instructions** to modify only changed sections
3. **Diff detection** identifies what actually changed
4. **Explainer documents** specific modifications made

This ensures:
- Faster iterations
- Preserved working code
- Clear change tracking
- Better user experience

## ⚙️ Component System Design

### Determinism Guarantee

Each component has:
- **Fixed TypeScript interface** defining allowed props
- **Frozen Tailwind classes** - no dynamic class generation
- **Consistent rendering** - same props always produce same output
- **No customization escape hatches** - no style props, no className injection

### Example: Button Component

```typescript
export interface ButtonProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}
```

Styling is completely predetermined - AI can only set variant/size props.

## 🚧 Known Limitations

1. **Limited Component Set**: Only 8 components available
   - Cannot create custom layouts beyond what these allow
   - Complex UIs may require creative composition

2. **No Dynamic Styling**: Components have fixed styling
   - Cannot adjust colors, spacing, or fonts per instance
   - Limited visual customization options

3. **In-Memory Storage**: Version history lost on server restart
   - No persistent database
   - Sessions are temporary

4. **Preview Limitations**: Code evaluation in browser
   - Complex state management may not work perfectly
   - Some React features require different rendering approach

5. **Gemini API Rate Limits**: Subject to API quotas
   - May hit rate limits with heavy usage
   - No local fallback

## 🔮 Future Improvements (With More Time)

### High Priority
- **Persistent Storage**: Database for version history and user sessions
- **Streaming Responses**: Real-time AI output as it generates
- **Diff View**: Visual side-by-side comparison of versions
- **Export Functionality**: Download generated code as files
- **Component Schema Validation**: Stricter TypeScript checking

### Medium Priority
- **Undo/Redo**: Git-style history navigation
- **Code Formatting**: Prettier integration for cleaner output
- **Error Recovery**: Better handling of generation failures
- **Performance Optimization**: Caching and memoization

### Nice to Have
- **Collaborative Editing**: Multi-user sessions
- **Component Preview Gallery**: Browse available components
- **Theme Customization**: Allow user-defined color schemes (still deterministic)
- **Accessibility Audit**: Automated a11y checking
- **Mobile Responsive Preview**: Test different screen sizes

## 📊 Evaluation Criteria Checklist

- ✅ **Agent Design**: Three distinct agents with clear separation
- ✅ **Determinism**: Components render identically every time
- ✅ **Iteration**: Modifies code correctly without full rewrites
- ✅ **Explainability**: AI decisions are clear and understandable
- ✅ **Engineering Judgment**: Good scoping and practical tradeoffs
- ✅ **Safety**: Component whitelist enforcement and input sanitization
- ✅ **UI**: Three-panel layout with chat, code, and preview
- ✅ **Version Control**: Rollback functionality working
- ✅ **Code Quality**: Clean, typed, well-structured

## 🎥 Demo Video

See the [Demo Video](demo-video-link) for a walkthrough of:
- Initial UI generation from natural language
- Iterative modification via chat
- Live preview updating in real-time
- AI explanations of decisions
- Version rollback functionality

## 📝 License

MIT License - see LICENSE file for details

## 👤 Author

**Your Name**
- Email: your.email@example.com
- GitHub: @yourusername

---

**Submission for Ryze AI Full-Stack Assignment**
