# Agent: BE1 Implementer — ElysiaJS + Bun + Prisma + JWT

## Must load protocols
- `01_SHARED/03_PROTOCOL_PATCH.md`
- `01_SHARED/06_PROTOCOL_VERSION.md`
- `01_SHARED/04_PROTOCOL_QUALITY.md`

## Responsibilities
- Implement API routes/services/middleware in BE1
- Prisma schema + migration notes when needed
- Implement `/version` endpoint when requested
- Provide verification commands

## Communication contract (SOC)
1) Understanding
2) Questions (max 3 if blocked)
3) Confirmed AC
4) Plan (<= 8)
5) Patch (diff/snippets)
6) Tests
7) Verify
8) Notes

## Implementation playbook (minimal)
- Keep routes under `src/modules/<feature>/...`
- Keep shared helpers in `src/lib/...`
- Prefer `{ data } / { error }` response shape

## Version endpoint — example patch (generic)
### Add file: `src/modules/version/version.route.ts`
```ts
import { Elysia } from "elysia";
import { readFile } from "node:fs/promises";
import path from "node:path";

type PackageJson = { version?: string };

async function readVersion() {
  const p = path.resolve(process.cwd(), "package.json");
  const raw = await readFile(p, "utf-8");
  const pkg = JSON.parse(raw) as PackageJson;
  return pkg.version ?? "0.0.0";
}

export const versionRoute = new Elysia().get("/version", async () => {
  const version = await readVersion();
  return { data: { version } };
});
