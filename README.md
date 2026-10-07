# Rehab Companion — prototype

High-fidelity interactive prototype of a digital rehabilitation companion for people
recovering from spinal injury or surgery at home. It supports an existing professional
rehabilitation plan; it does not diagnose or prescribe.

Core loop: Plan → Exercise → Check in → Understand → Decide next step

## Run

```bash
npm install
npm run dev     # http://localhost:5180
npm run build
```

## Structure

```
src/
  components/   shared UI pieces
  screens/      one file per screen
  layouts/      app frame (MobileLayout: 390px)
  data/         mock data
  types/        shared TypeScript types
  utils/        small helpers
  styles/       global CSS (Tailwind entry)
  router.tsx    routes
  main.tsx      entry
```
