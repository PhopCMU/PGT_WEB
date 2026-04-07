# quality bar + DoD
# Protocol: Quality Bar (QBAR v2)

## Definition of Done
- Meets AC
- Minimal diff, consistent style
- Handles at least 1 error case
- Has tests OR clear manual verification steps
- No secrets/tokens in output
- Provides verify commands

## Quick checklists
### Backend
- validation for write endpoints
- authz check where relevant
- prisma errors mapped (unique -> 409, not found -> 404)
- migration safety reviewed

### Frontend
- loading/empty/error states
- basic a11y for forms/nav
- avoids hard-coding API base URLs