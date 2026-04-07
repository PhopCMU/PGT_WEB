# รูปแบบ patch/diff + สัญญา I/O
# Protocol: Patch Output (PATCH v2)

## Purpose
Standardize code output to reduce tokens and increase reviewability.

## Patch rules
- Output ONLY changed sections.
- Use unified diff when possible:
  - `--- a/...`
  - `+++ b/...`
  - `@@ ...`
- If diff is too heavy, output:
  - File path
  - "Add/Replace this block" with minimal code

## Required patch metadata
- Files changed: list
- Reason per file: 1 line
- Breaking changes: yes/no

## Error response shape recommendation (backend)
- Success: `{ data: ... }`
- Error: `{ error: { code, message, details? } }`