# Adminer (Docker Compose)

Adminer is a lightweight web-based database management tool that supports MySQL, PostgreSQL, MariaDB, SQLite, and more.

## How it works

1. Adminer runs as a single web application container.
2. You open the Adminer UI and provide DB connection details.
3. Adminer connects directly to your database server.
4. You can run queries, browse tables, and manage schema/data from the browser.

## Stack details in this repo

- Image: `adminer:latest`
- Container name: `adminer`
- Web UI: `http://<host-ip>:8081` (default)
- Port mapping:
  - `${ADMINER_PORT:-8081}:8080`

## Environment variables

Copy `.env.example` to `.env`:

- `ADMINER_PORT` (default: `8081`)

## How to run

From the repository root:

```bash
cd adminer
cp .env.example .env
docker compose up -d
```

If you use Podman:

```bash
cd adminer
cp .env.example .env
podman compose up -d
```

Open:

- `http://localhost:8081` (or your configured port)

## Use it effectively

- For Compose-based databases, use the service name as server host (e.g. `db`, `postgres`, `mysql`).
- For host databases, use reachable host/IP and correct port.
- Use least-privilege DB credentials for routine operations.

## Notes

- Adminer does not persist your database data; it is only a management UI.
- Restrict external exposure of Adminer in production environments.
