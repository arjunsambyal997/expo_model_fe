# Idea Board Web

Next.js (App Router, TypeScript) + Tailwind CSS v4 + Framer Motion + anime.js frontend for the Idea Board app.

The app lets the team propose ideas, explain them, and vote so the best ones get built.

## Screens
Landing, sign up, email verification, sign in (with demo logins shown), forgot/reset password, dashboard, ideas (create and vote), profile, settings, and an admin users page.

## Run locally
Start the API first (see the `expo_model_be` repo), then:

```bash
npm install
cp .env.example .env.local
npm run dev
```
Open http://localhost:3000. Demo logins (shown on the sign-in page): `demo@expo-summit.dev` / `demo12345`, admin `admin@expo-summit.dev` / `admin12345`.

## Scripts
- `npm run dev` start dev server
- `npm run build` production build
- `npm run lint` type check

## Notes
- Auth tokens are kept in localStorage for now. Move them to httpOnly cookies before production.
- Animations respect `prefers-reduced-motion`.
