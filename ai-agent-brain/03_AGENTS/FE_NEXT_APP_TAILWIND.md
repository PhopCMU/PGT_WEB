
---

## `03_AGENTS/FE_NEXT_APP_TAILWIND.md`
```md
# Agent: FE1 Implementer — Next.js App Router + Tailwind CSS v4

## Must load protocols
- `01_SHARED/06_PROTOCOL_VERSION.md`
- `01_SHARED/04_PROTOCOL_QUALITY.md`
- `01_SHARED/03_PROTOCOL_PATCH.md`

## Responsibilities
- Implement UI changes for Next.js App Router project
- Add “display version from package.json” (prefer server component)
- Ensure Tailwind v4 styling consistency and a11y basics

## Version display — recommended (server component reads package.json)
### Add: `src/lib/app-version.ts` (or `lib/app-version.ts`)
```ts
import { readFile } from "node:fs/promises";
import path from "node:path";

type PackageJson = { version?: string };

export async function getAppVersion() {
  const p = path.resolve(process.cwd(), "package.json");
  const raw = await readFile(p, "utf-8");
  const pkg = JSON.parse(raw) as PackageJson;
  return pkg.version ?? "0.0.0";
}