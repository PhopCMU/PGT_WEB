# GEMINI.md - PGT-NEW Project Overview

## Project Overview
**PGT-NEW** (Postgraduate Education Center) is a modern web application developed for the Faculty of Veterinary Medicine at Chiang Mai University. It serves as a platform for managing postgraduate education-related tasks, including project registration and user profile management. The application is built as a Progressive Web App (PWA) to provide a native-like experience on mobile devices.

### Core Technologies
- **Frontend Framework:** [React 19](https://react.dev/) (Vite)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Routing:** [React Router v7](https://reactrouter.com/)
- **HTTP Client:** [Axios](https://axios-http.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **PWA:** [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- **Validation:** [Zod](https://zod.dev/)
- **QR Scanning:** [jsQR](https://github.com/cozmo/jsQR)

---

## Project Structure

```text
src/
├── components/       # Reusable UI components (Auth, Layouts, etc.)
├── contexts/         # React Contexts (Alert, Loading)
├── hooks/            # Custom React hooks (e.g., useUserProfile)
├── lib/              # Library configurations (Axios, API setup)
├── pages/            # Top-level page components
├── pwa/              # PWA-specific components (UpdatePrompt)
├── services/         # API service layers (GET, POST, PUT)
├── types/            # TypeScript type definitions
└── utils/            # Utility functions and services (Auth, Helpers)
```

---

## Key Features
- **PWA Support:** Full offline support with service worker caching (NetworkFirst for APIs, CacheFirst for assets).
- **Authentication:** Complete flow including Login, Registration, Reset Password, and Protected Routes.
- **QR Code Scanning:** Integrated QR code scanning for various project activities.
- **Registration Management:** Tools for managing project registration lists.
- **Responsive Design:** Optimized for both desktop and mobile use, featuring a custom splash screen and mobile-friendly layouts.

---

## Building and Running

### Development
To start the development server:
```bash
bun run dev
```

### Production Build
To create a production-ready build:
```bash
bun run build
```

### Preview Build
To preview the production build locally:
```bash
bun run preview
```

### Linting
To run ESLint:
```bash
bun run lint
```

---

## Development Conventions
- **Naming:** Components should use PascalCase (e.g., `RegisterForm.tsx`). Utility files and hooks use camelCase (e.g., `useUserProfile.ts`).
- **Styling:** Utility-first CSS with Tailwind CSS v4. Avoid custom CSS files unless necessary (e.g., `App.css`, `index.css`).
- **API Services:** All API calls should be organized within `src/services/` and use the pre-configured `api` instance from `src/lib/api.ts`.
- **Environment Variables:** API base URL is managed via `VITE_API_BASE_URL` in `.env` files.
- **PWA Configuration:** Managed in `vite.config.ts` using `vite-plugin-pwa`.
