# SNIP.IT UI

Frontend for a colorful URL shortener with analytics. Users can shorten long URLs, copy the generated short link, and view detailed click statistics by link code.

## Features

- Shorten URLs with a simple form and inline error handling
- Copy-to-clipboard for generated short links
- Link stats page with daily click chart and event list
- Polished gradients, animations, and responsive layout

## Tech Stack

- React 19 + TypeScript
- Vite 7
- React Router
- Tailwind CSS v4 (with custom CSS tokens and animations)

## Routes

- `/` - Shortener home page
- `/stats` - Stats lookup by link code
- `/stats/:code` - Stats view for a specific link

## API Requirements

The UI expects a backend that exposes:

- `POST /api/links` -> create a short link
- `GET /api/links/:code` -> fetch link details
- `GET /api/links/:code/events` -> fetch click events

All requests are sent to the base URL set by `VITE_API_URL`.

## Environment Variables

Create a local `.env` file (do not commit it) based on `.env.example`:

```
VITE_API_URL=http://localhost:3000
```

Vite will inject any `VITE_*` variables into `import.meta.env` at dev/build time.

## Getting Started

```bash
npm install
cp .env.example .env
npm run dev
```

## Scripts

- `npm run dev` - Start the dev server
- `npm run build` - Typecheck and build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
