# n8n + PostgreSQL

This stack runs n8n with PostgreSQL as the workflow database backend.  
It is suitable for more durable/self-hosted setups than SQLite-only deployments.

## How it works

1. `postgres` starts and stores n8n data persistently.
2. `n8n` connects to PostgreSQL using the configured DB environment variables.
3. Workflows, credentials, and execution state are saved in Postgres.
4. n8n editor/API is exposed on port `5678`.

## Stack details in this repo

- n8n image: `docker.n8n.io/n8nio/n8n:latest`
- PostgreSQL image: `postgres:15`
- n8n UI/API: `http://<host-ip>:5678`
- Persistent data:
  - `data:/root/.n8n`
  - `postgres_data:/var/lib/postgresql/data`

## Environment variables

Copy `.env.example` to `.env`, then adjust values:

- `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`
- `DB_POSTGRESDB_*` settings
- `N8N_*` runtime/security/URL settings
- `WEBHOOK_URL`, `TZ`

## How to run

From the repository root:

```bash
cd n8n+postgresql
cp .env.example .env
docker compose up -d
```

Open:

- `http://localhost:5678`

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Notes

- Avoid committing real credentials/URLs in `.env`.
- If exposed behind reverse proxy, keep `N8N_HOST`, `N8N_PROTOCOL`, and webhook URLs consistent.
