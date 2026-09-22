# ScriptFlow ✍️🎬

> **The dedicated scriptwriting studio for YouTube creators, podcasters, and video storytellers.**  
> Write better hooks, plan B-roll, pace your delivery, and leverage surgical AI tailored specifically for video retention.

---

## ✨ Features at a Glance

### 🖥️ Distraction-Free Studio Canvas
- **Fluid Whole-Width Canvas**: Write edge-to-edge across widescreen displays without artificial margins. Switch between `Whole Width (100% Fluid)`, `Wide (1200px)`, and `Standard (800px)` with 1 click.
- **TipTap Rich Text Editor**: Clean typography with headings, callouts, lists, highlights, custom font sizes, and inline handwriting/drawing directly in your script.
- **Real-Time Delivery Metrics**: Live word count, character count, and estimated speaking duration based on average human speech pace.

### 🧠 Multi-Model AI Engine (Mistral AI & Google Gemini)
- **Automated Cascading Fallbacks**: Built with a multi-model cascade (`mistral-small-latest` → `open-mistral-nemo` → `mistral-medium-latest` → `codestral`). If one model hits rate limits (HTTP 429), it silently cascades to the next.
- **Modular & Model-Agnostic**: Easily toggle between **Mistral AI**, **Google Gemini**, **OpenAI**, **Groq**, or **OpenRouter** simply by changing 2 lines in `.env`.
- **Surgical AI Enhancements**: Highlight text to make it punchier, fix pacing, inject emotional resonance, or ask the AI strategist questions about your entire script.

### 🎣 Viral Hook Library
- Over 50+ battle-tested hook formulas (Curiosity Gap, High Stakes, Bold Prediction, Story-First, Counter-Intuitive, Contradiction).
- Filter by style, platform, and content type, and insert directly with 1 click.

### 🎬 Production & B-Roll Planner
- Break scripts down into structured sections (Hook, Problem, Solution, Climax, Outro/CTA).
- Attach specific B-roll notes, graphic overlays, camera angles, and visual cues to every talking point.

### 📺 Integrated Teleprompter Mode
- Dedicated full-screen teleprompter for recording.
- Variable scrolling speed, mirror mode for beam-splitter prompter glass, and adjustable typography.

### 📦 Creator Packaging & Studio Tools
- **Thumbnail Concept Generator**: Generates high-contrast visual concepts, facial emotions, and text overlays aligned with your script's hook.
- **YouTube Metadata & Chapters**: Auto-generate CTR-optimized descriptions, SEO tags, hashtags, and realistic video chapters with timestamps.
- **Sponsor Segment Builder**: Crafts authentic, non-jarring 45-60s sponsor reads with organic entry and exit transitions.
- **1-Click Viral Short Extractor**: Automatically identifies the top 2-3 viral moments from a long script and extracts them into ready-to-record vertical Shorts/Reels.

### 🔄 Multi-Platform Repurposing
- Transform long scripts into Twitter/X threads, LinkedIn carousels, newsletters, and vertical short scripts.

### ⚡ Offline & Testing Mode
- Ready out of the box with zero required authentication.
- Seamless fallback to `localStorage` when offline or testing without Supabase credentials.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Editor Engine**: [TipTap](https://tiptap.dev/) (ProseMirror core)
- **AI Infrastructure**: [Mistral AI API](https://mistral.ai/), [Google Gemini API](https://aistudio.google.com/), OpenAI-compatible generic adapter
- **Backend / Auth**: [Supabase](https://supabase.com/) (with complete local storage fallback)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown & PDF**: [marked](https://github.com/markedjs/marked), [html2pdf.js](https://ekoopmans.github.io/html2pdf.js/)

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/jayant13042004/scriptflow.git
cd scriptflow
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Copy the template:
```bash
cp .env.example .env
```

Edit `.env` with your preferred AI provider:
```env
# AI Provider: mistral (default), gemini, openai, groq, openrouter, or mock
VITE_AI_PROVIDER=mistral

# Add your Mistral API Key (from https://console.mistral.ai/api-keys/):
VITE_MISTRAL_API_KEY=your_mistral_api_key_here

# (Optional) Primary model - defaults to mistral-small-latest:
VITE_MISTRAL_MODEL=mistral-small-latest
```

### 4. Start the development studio
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## ⚙️ Environment Variables Reference

| Variable | Description | Default |
| :--- | :--- | :--- |
| `VITE_AI_PROVIDER` | Active AI provider (`mistral`, `gemini`, `openai`, `groq`, `openrouter`, `mock`) | `mistral` |
| `VITE_MISTRAL_API_KEY` | Your Mistral AI API key | `""` |
| `VITE_MISTRAL_MODEL` | Preferred Mistral model (`mistral-small-latest`, `mistral-large-latest`, `open-mistral-nemo`) | `mistral-small-latest` |
| `VITE_GEMINI_API_KEY` | Google Gemini API key (optional) | `""` |
| `VITE_GEMINI_MODEL` | Preferred Gemini model | `gemini-2.5-flash` |
| `VITE_AI_API_KEY` | Universal API key for OpenAI, Groq, or OpenRouter | `""` |
| `VITE_SUPABASE_URL` | Supabase project URL (optional - falls back to local storage) | `""` |
| `VITE_SUPABASE_ANON_KEY` | Supabase anonymous API key (optional) | `""` |

---

## 📁 Project Structure

```
src/
├── components/
│   ├── ai/            # AI Assistant panel, Voice Script mode, Ideas modal
│   ├── dashboard/     # Script cards, playlist modals, analytics
│   ├── editor/        # TipTap editor toolbar, stats, find & replace, export/import
│   ├── hooks/         # Viral Hook Library
│   ├── landing/       # Interactive landing page, Hook Lab, comparison tables
│   ├── planner/       # B-Roll and production shot list planner
│   ├── playlist/      # Series & Playlist management
│   ├── repurpose/     # Multi-platform content repurposing
│   ├── studio/        # Thumbnails, YouTube metadata, Sponsor block, Short extractor
│   ├── teleprompter/  # Full-screen teleprompter mode
│   └── ui/            # Modal, Toast, Button components
├── data/              # Curated blogs, hook formulas, templates
├── pages/             # Studio routes (Dashboard, Editor, Blog, Auth, Legal)
├── services/
│   ├── ai/            # BaseAiService, MistralAiService, GeminiAiService, OpenAiService
│   └── supabase/      # Cloud sync & storage services
└── stores/            # Zustand stores for editor, scripts, playlists, and auth
```

---

## 🛡️ License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
