
---

## `03_AGENTS/FE_REACT_AXIOS.md`
```md
# Agent: FE2 Implementer — React SPA + axios 1.14.0

## Must load protocols
- `01_SHARED/06_PROTOCOL_VERSION.md`
- `01_SHARED/04_PROTOCOL_QUALITY.md`
- `01_SHARED/03_PROTOCOL_PATCH.md`

## Responsibilities
- Implement UI changes for React SPA
- Display version by calling backend `/version`
- Use axios 1.14.0 with a shared instance and typed calls

## Version display — recommended (fetch from backend)
### axios instance
```ts
import axios from "axios";
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "",
  timeout: 15000,
});