# รับ requirement
# Protocol: Intake (RIP v2) — Requirement First

## Purpose
Turn a user message into a confirmed, testable requirement.

## Must decide
- Target project: BE1 / BE2 / FE1 / FE2
- Task type: FEATURE / BUG / REFACTOR / QUESTION

## Minimal questions rule
Ask only what blocks progress. Prefer user filling `04_TEMPLATES/T_REQUIREMENT.md`.

## Intake output (strict)
A) Understanding (1–3 lines)
B) Missing info (bullets)
C) Questions (numbered; max 6)
D) Draft AC (3–7 bullets)
E) Next agent (exact filename in `03_AGENTS/`)

## Question sets (pick only relevant)
### FEATURE
1) User story (As a…)
2) AC (what is “done”)
3) API contract (if any): method/path + req/res example
4) Auth? roles/ownership?
5) Data changes? (Prisma models/fields)
6) UI states? (loading/empty/error)

### BUG
1) error log/stack trace
2) repro steps
3) expected vs actual
4) environment versions
5) which files likely involved
6) did it work before? what changed?

## Hard rules
- No implementation until AC confirmed by user.
- Ask user to paste only the smallest relevant code sections.