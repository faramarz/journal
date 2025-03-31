# EchoNest

An AI-powered voice journal app where your voice becomes your story.

## Features
- Voice recording in-browser
- Transcription (Whisper or AssemblyAI)
- Sentiment analysis (OpenAI)
- Reflection prompt (GPT)
- Auth and storage via Supabase

## Getting Started
```bash
bash scripts/setup.sh
yarn dev # or npm run dev
```

## Tech Stack
- Next.js App Router
- Supabase (auth + DB)
- TailwindCSS + shadcn/ui
- OpenAI + AssemblyAI

## UI Screens & Flow
1. **Auth / Onboarding**
   - Welcome screen
   - Magic link login (Supabase)
2. **Dashboard**
   - Record New Entry UI
   - Transcription preview
   - Save + analyze action
3. **Timeline View**
   - Entry cards (date, snippet, sentiment)
   - Expand for full text
4. **Daily Prompt**
   - GPT-generated daily prompt
   - Regenerate + journal from prompt
5. **UX Enhancements**
   - Toasts, modal confirm, error handling
   - Dark mode
   - Mobile responsive

---

// Directory structure
/app            → Next.js routes (App Router)
/components     → UI components
/lib            → utils (e.g., transcription.ts, sentiment.ts)
/hooks          → custom React hooks
/types          → TypeScript interfaces
/public         → static assets
