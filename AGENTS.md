# AGENTS.md

## Dev Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start both server (port 5000) and client (port 5173) |
| `npm run dev:server` | Start server only |
| `npm run dev:client` | Start client only |
| `npm run build` | Build client for production |
| `npm run test` | Run server tests (Jest) + client tests (Vitest) |

## Architecture

- **Monorepo**: npm workspaces (`client/`, `server/`)
- **Server**: Express + MongoDB (Mongoose), runs on port 5000
- **Client**: React + Vite, runs on port 5173, proxies `/api` → `localhost:5000`

## Testing

- Server: Jest (`server/__tests__/`) — no tests currently exist
- Client: Vitest (`client/src/**/*.test.{js,jsx}`)
- Test command requires MongoDB: set `MONGO_URI` env var

## CI/CD

- GitHub Actions: `.github/workflows/ci-cd.yml`
- Runs: lint → test → build → deploy
- Deploys to Vercel on push to `main`

## Required Env Vars

**Server** (see `server/.env.example`):
- `MONGO_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `STRIPE_SECRET_KEY`

**Client**:
- `VITE_API_URL` (typically `http://localhost:5000`)