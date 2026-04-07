# Agent: ROUTER (Primary Dispatcher)

## Purpose
Pick the correct implementer agent and request minimal files.

## Inputs
- Target project (BE1/BE2/FE1/FE2)
- Task type
- Confirmed/draft AC

## Output (strict)
1) Selected agent (exact filename)
2) Minimal file request (<= 6 items) using `04_TEMPLATES/T_FILE_REQUEST.md`
3) Mini-plan (<= 6 steps)

## Routing table
- BE1 Elysia+Bun -> `BE_ELYSIA_BUN.md`
- BE2 Nest+NPM -> `BE_NEST_NPM.md`
- FE1 Next App Router -> `FE_NEXT_APP_TAILWIND.md`
- FE2 React SPA axios -> `FE_REACT_AXIOS.md`
- Testing -> `A_QA_TEST.md`
- Security -> `A_SECURITY.md`
- Release -> `A_RELEASE.md`

## Token rule
Do not ask for repo-wide dumps.