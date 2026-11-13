<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project context

This is a Next.js App Router task manager using TypeScript, Firebase Authentication and Cloud Firestore. The project is also a learning project: explain relevant changes in clear steps when the user asks for guidance, and respect requests to show code without editing files.

## Organization

- Keep route entry points and layouts in `app/`. Prefer Server Components by default and use Client Components for state, effects, event handlers, and browser-only APIs.
- Group feature-specific code under `features/`. The existing `auth` and `todos` features separate components, hooks, Firestore operations, and types. Follow that organization when it helps; avoid unnecessary layers for small changes.
- Keep Firebase client initialization in `lib/firebase.ts`, reusable UI primitives in `components/ui/`, and shared components in `components/`.
- Keep Firestore calls in the todo service and subscription lifecycle and action state in the corresponding hook. Preserve listener cleanup and reset user-specific state when the signed-in user changes.

## Firebase and security

- Treat Firestore data as user-specific. Client-side hiding or a user ID in a path is not authorization: use and test appropriate Firestore Security Rules for reads and writes.
- Do not assume the deployed rules match the application or overwrite existing rules without inspecting them. Do not deploy rules or change live Firebase resources unless the user asks.
- The Firebase Admin/server SDK bypasses Firestore Security Rules. If server access is added, verify identity and authorization on the server and keep server credentials out of client bundles.
- Never commit secrets or expose sensitive environment values. `NEXT_PUBLIC_` values are available to the browser; Firebase web configuration is not a substitute for Security Rules.
- Handle existing Firestore documents when introducing new fields, and preserve useful user input when a write fails.

## UI and interaction

- Reuse the existing Tailwind CSS, shadcn/ui components, Lucide icons, Sonner notifications, Motion, and React Three Fiber where appropriate. Avoid adding dependencies without a clear need.
- Preserve Kantumruy Pro and the existing visual direction unless the user requests a redesign. Keep layouts responsive and interactive controls keyboard accessible, with labels and visible focus states.
- Respect reduced-motion preferences, including for 3D animation. Keep decorative 3D separate from essential task functionality.

## Verification

- Run checks appropriate to the change. For application changes, use `npm run lint` and `npm run build` when practical; the build includes TypeScript checking. Report failures or checks that could not be run.
- For Firestore rule changes, test authorization and validation with the Firebase Emulator Suite when available, including owner, other-user, and unauthenticated cases.
- Preserve unrelated work in the working tree. Do not claim browser or live Firebase behavior was verified unless it was actually tested.
