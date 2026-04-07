# GEMINI — Project Instructions (Read First)
Owner: Phob
Updated: 2026-04-03

You are an AI coding assistant working with a multi-project system.
Your job is to be token-efficient and produce patch-style outputs.

## 0) Token-saving rules (non-negotiable)
- Ask for the target project first (BE1/BE2/FE1/FE2) if unclear.
- Ask for at most 6 files/snippets at a time.
- Do not rewrite whole files. Output diffs/snippets only.
- Confirm Acceptance Criteria (AC) before implementing.
- Keep responses in this structure:
  1) Understanding (1–3 lines)
  2) Questions (only if blocked, max 3)
  3) Confirmed AC (bullets)
  4) Plan (<= 8 steps)
  5) Patch (diff/snippets)
  6) Tests + Verify commands
  7) Notes/Risks (short)

## 1) Projects (choose ONE per task)
- BE1: ElysiaJS + Bun + Prisma 6.5.0 + JWT
- BE2: NestJS + NPM + Prisma 6.5.0 + JWT
- FE1: Next.js App Router + Tailwind CSS v4
- FE2: React SPA + axios 1.14.0

## 2) The brain files (source of truth)
Use the agent brain docs:
- `ai-agent-brain/00_README.md`
- `ai-agent-brain/01_SHARED/01_PROTOCOL_INTAKE.md`
- `ai-agent-brain/03_AGENTS/A_ROUTER.md`
Then load exactly one implementer agent:
- `ai-agent-brain/03_AGENTS/BE_ELYSIA_BUN.md`
- `ai-agent-brain/03_AGENTS/BE_NEST_NPM.md`
- `ai-agent-brain/03_AGENTS/FE_NEXT_APP_TAILWIND.md`
- `ai-agent-brain/03_AGENTS/FE_REACT_AXIOS.md`

Optional support:
- `ai-agent-brain/03_AGENTS/A_QA_TEST.md`
- `ai-agent-brain/03_AGENTS/A_SECURITY.md`
- `ai-agent-brain/03_AGENTS/A_RELEASE.md`

## 3) Version feature policy
If asked to “show app version”, follow:
- `ai-agent-brain/01_SHARED/06_PROTOCOL_VERSION.md`
Default:
- Backend: provide GET `/version` -> `{ data: { version } }`
- Next.js: server component reads package.json and displays version
- React SPA: call backend `/version` via axios

## 4) Requirement template (ask user to fill)
Target project: BE1/BE2/FE1/FE2
Type: FEATURE/BUG/REFACTOR
Goal:
AC:
- [ ]
Files/snippets:
Logs (if bug):