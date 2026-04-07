# COPILOT — Repository Instructions (Read First)
Owner: Phob
Updated: 2026-04-03

## Purpose
This repo uses an "AI Agent Brain" to standardize work and reduce token usage.

## Where to read (source of truth)
- `ai-agent-brain/00_README.md`
- `ai-agent-brain/01_SHARED/03_PROTOCOL_PATCH.md`
- `ai-agent-brain/01_SHARED/05_PROTOCOL_TOKEN.md`
- `ai-agent-brain/01_SHARED/06_PROTOCOL_VERSION.md`

## Default workflow
1) Intake:
   - Confirm target project (BE1/BE2/FE1/FE2)
   - Confirm task type (FEATURE/BUG/REFACTOR)
   - Confirm AC
2) Plan:
   - <= 8 steps
   - predict files to touch
3) Implement:
   - patch-only output
   - minimal diffs
4) Validate:
   - tests + verify commands
5) Optional:
   - QA/Security/Release agents

## Patch format rules
- Prefer unified diff.
- If not possible, include file path + "Replace this block" approach.
- Do not paste unchanged code.

## Version display requirement (common request)
- Backend: implement `GET /version` returning `{ data: { version } }`
- Next.js: display version in a server component (footer by default)
- React: fetch `/version` using axios

## Request template (copy/paste)
Target project:
Type:
Goal:
Acceptance Criteria:
Relevant files/snippets:
Logs: