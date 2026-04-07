# Protocol: Token Saving (TOK v2)

## Rules
1) Ask for a maximum of 6 files at a time.
2) Ask for "relevant snippet + filename + lines" not whole repo.
3) Keep responses in SOC structure (see README).
4) Never repeat long context; reference by file path.
5) Prefer “next action” instructions over explanations.

## File request strategy
- Ask for entrypoint + related module + schema + failing log only.
- If unclear, ask for `tree -L 2` of relevant folder (not whole repo).

## When blocked
Ask max 3 questions, then wait.