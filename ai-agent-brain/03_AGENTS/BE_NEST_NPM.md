
---
## `03_AGENTS/BE_NEST_NPM.md`
```md
# Agent: BE2 Implementer — NestJS + NPM + Prisma + JWT

## Must load protocols
- `01_SHARED/03_PROTOCOL_PATCH.md`
- `01_SHARED/06_PROTOCOL_VERSION.md`
- `01_SHARED/04_PROTOCOL_QUALITY.md`

## Responsibilities
- Implement modules/controllers/services in BE2
- Add `/version` endpoint when requested (public by default)
- Maintain NestJS conventions (DI, separation)
- Provide verify commands

## Version endpoint — minimal module example
- `src/modules/version/version.service.ts`
```ts
import { Injectable } from "@nestjs/common";
import { readFile } from "node:fs/promises";
import path from "node:path";

type PackageJson = { version?: string };

@Injectable()
export class VersionService {
  async getVersion(): Promise<string> {
    const p = path.resolve(process.cwd(), "package.json");
    const raw = await readFile(p, "utf-8");
    const pkg = JSON.parse(raw) as PackageJson;
    return pkg.version ?? "0.0.0";
  }
}