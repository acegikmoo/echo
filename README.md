# Echo

Turn a text prompt into a live, editable Next.js application — instantly.

Echo uses Gemini AI to generate full-stack code, runs it in an isolated E2B sandbox, and streams a live preview back to you. Iterate with follow-up prompts until it's exactly what you want.

![Demo Screenshot](./public/demo.png)

---

## Features

- Prompt → live website in seconds
- Live preview with hot reload via E2B sandboxes
- File tree explorer with syntax highlighting
- Follow-up prompts for iterative refinement
- Persistent projects and message history
- GitHub OAuth + email/password authentication

---

## Tech Stack

Next.js 15 · TypeScript · Tailwind CSS v4 · shadcn/ui · tRPC v11 · Drizzle ORM · PostgreSQL · Better Auth · Inngest · Gemini 2.0 Flash · E2B · TanStack Query v5

---

## Getting Started

**Prerequisites:** Node.js 18+, Bun, PostgreSQL, E2B account, Google AI API key
```bash
git clone https://github.com/acegikmoo/echo.git
cd echo
bun install
bun db:push
bun dev
```

For background jobs, run the Inngest dev server in a separate terminal:
```bash
npx inngest-cli@latest dev
```

---

## Environment Variables

Copy `.env.example` to `.env` and fill in the values:
```env
BETTER_AUTH_SECRET=           # Production only
BETTER_AUTH_GITHUB_CLIENT_ID=
BETTER_AUTH_GITHUB_CLIENT_SECRET=
BETTER_AUTH_URL=http://localhost:3000

DATABASE_URL=postgresql://postgres:password@localhost:5432/echo

E2B_API_KEY=
GOOGLE_API_KEY=
```

---

## Project Structure
```
src/
├── app/
│   ├── (auth)/          # Sign-in, sign-up
│   ├── (main)/          # Dashboard, project view
│   └── api/             # tRPC, Inngest, Auth handlers
├── components/
│   ├── ui/              # shadcn/ui primitives
│   ├── fragments/       # Live preview, file explorer
│   ├── messages/        # Chat UI
│   └── project/         # Project form and layout
└── server/
    ├── api/             # tRPC routers
    ├── better-auth/     # Auth config
    ├── db/              # Drizzle schema and client
    └── inngest/         # AI agent, tools, system prompt
```

---

## Deployment

Designed for **Vercel** + a managed PostgreSQL provider (Neon, Supabase).

1. Set all environment variables in your Vercel project
2. Update the GitHub OAuth redirect URI to your production domain
3. Connect your production database and Inngest account
4. Deploy

---

## Roadmap

- Export project as ZIP
- One-click deploy to Vercel
- Version history per project
- Team collaboration
- Usage limits and billing

---

## License

MIT
