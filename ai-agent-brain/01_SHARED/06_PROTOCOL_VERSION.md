# Protocol: App Version Display (VERSION v2)

## Goal
Display application version (from package.json) safely and consistently.

## Standard API response (if using endpoint)
`GET /version` -> `{ data: { version: "x.y.z" } }`

## Preferred approach per project
- BE (Elysia/Nest): implement `GET /version` reading `process.cwd()/package.json`
- FE Next.js App Router: prefer server component reading package.json directly (Option A)
- FE React SPA: prefer calling backend `/version` (browser cannot reliably read package.json)

## Security
- Only expose the `version` field.
- Do not expose full package.json.

## Error handling
If cannot read version -> return "0.0.0" or a safe default.