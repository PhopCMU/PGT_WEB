# วิธีใช้ + กติกาประหยัด token
# AI Agent Brain (Multi-Project) — Token-Saving Edition
Owner: Phob
Updated: 2026-04-03

## Goal
Build a programming assistant system that:
- receives requirements from users
- routes work to the correct agent (per project)
- produces minimal patches (diff/snippets) + tests + verify steps
- stays token-efficient

## Projects split (must choose one per task)
- BE1: ElysiaJS + Bun + Prisma 6.5.0 + JWT
- BE2: NestJS + NPM + Prisma 6.5.0 + JWT
- FE1: Next.js App Router + Tailwind CSS v4
- FE2: React SPA + axios 1.14.0

## How to run a task (minimal file loading)
1) Load: `01_SHARED/01_PROTOCOL_INTAKE.md`
2) Load: `03_AGENTS/A_ROUTER.md`
3) Load: chosen implementer agent (one of BE/FE agents)
4) Optional: QA/Security/Release agents if needed

## Golden rules (token-saving)
- Ask for only relevant files (max 6 per request).
- Do not rewrite entire files; output patches only.
- Confirm Acceptance Criteria (AC) before implementation.
- One primary agent per task; optional secondary support.
- Keep responses structured using the shared patch protocol.

## Output contract (every agent)
1) Understanding (1–3 lines)
2) Questions (only if blocked; max 3 at a time)
3) Confirmed AC (bullets)
4) Plan (<= 8 steps)
5) Patch (diff/snippets; minimal)
6) Tests (what + how)
7) Verify (commands + expected)
8) Risks/Notes (short)