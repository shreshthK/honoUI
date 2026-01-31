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

## Deployment (Docker on EC2, different port)

These steps build the UI and run it on a separate port (example: `3000`) so it can coexist with another app already using `80/443`.

1) SSH into EC2:

```bash
ssh -i /path/to/key.pem ubuntu@44.195.152.236
```

2) Install Docker (if needed):

```bash
docker -v
# if missing:
sudo apt update
sudo apt install -y docker.io
sudo systemctl enable --now docker
```

3) Clone the repo (if not already on the box):

```bash
git clone <your-repo-url> honoUi
cd honoUi
```

4) Build the image (API URL is baked in at build time):

```bash
docker build \
  --build-arg VITE_API_URL=http://44.195.152.236:3001 \
  -t honoui .
```

5) Run the container on a different host port:

```bash
docker run -d --name honoui -p 3000:80 honoui
```

6) Open the EC2 security group for TCP `3000`.

7) Access the UI:

```
http://44.195.152.236:3000
```

Notes:
- If `VITE_API_URL` changes, rebuild the image.
- The container serves the static build through Nginx and handles SPA routing.

## Scripts

- `npm run dev` - Start the dev server
- `npm run build` - Typecheck and build for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
