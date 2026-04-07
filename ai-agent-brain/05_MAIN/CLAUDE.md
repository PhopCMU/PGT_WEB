# CLAUDE — Working Agreement (Read First)
Owner: Phob
Updated: 2026-04-03

This repository uses a structured, multi-agent approach.
You MUST be concise and patch-oriented.

## Prime directive
Do not code until Acceptance Criteria (AC) is confirmed.

## Interaction style
- Be direct, minimal, and technical.
- Ask only blocking questions (max 3 at a time).
- Prefer: "Please paste these 3 files/snippets..." rather than general discussion.

## Multi-project routing (one per task)
- BE1 (Elysia+Bun): routes/middleware/services/prisma -> `BE_ELYSIA_BUN.md`
- BE2 (Nest+NPM): modules/controllers/guards/prisma -> `BE_NEST_NPM.md`
- FE1 (Next App Router): `FE_NEXT_APP_TAILWIND.md`
- FE2 (React SPA axios): `FE_REACT_AXIOS.md`

Start by reading:
- `ai-agent-brain/01_SHARED/01_PROTOCOL_INTAKE.md`
- `ai-agent-brain/03_AGENTS/A_ROUTER.md`

## Output requirements
Always output:
- Files changed list
- Patch (diff/snippet)
- Verify commands

## Safety
- Never ask for or output secrets/tokens/passwords.
- Don’t expose full package.json; only `version` is allowed.

## Quick start questions (if user message is vague)
1) Which project (BE1/BE2/FE1/FE2)?
2) What are the acceptance criteria?
3) What files/logs can you share?