# XAMPP-like PHP + MySQL (Docker Compose)

This stack provides a local PHP + MySQL development environment similar to a basic XAMPP workflow, but containerized with Docker Compose.

## How it works

1. `db` runs MySQL 8.0 and stores database data in a persistent volume.
2. `web` builds from the local Dockerfile and serves PHP app files from `./app`.
3. `web` waits for `db` health before starting.
4. The app connects to MySQL using the configured environment values.

## Stack details in this repo

- Database image: `mysql:8.0`
- Web service: built from local `Dockerfile`
- Ports:
  - Web: `http://<host-ip>:8080`
  - MySQL: `3306`
- Persistent data:
  - `db_data:/var/lib/mysql`
- App source mount:
  - `./app:/var/www/html`

## Environment variables

Set via `.env` (copy from `.env.example`):

- `MYSQL_ROOT_PASSWORD`
- `MYSQL_DATABASE`
- `MYSQL_USER`
- `MYSQL_PASSWORD`

## How to run

From the repository root:

```bash
cd xampp
cp .env.example .env
docker compose up -d --build
```

Open:

- App: `http://localhost:8080`

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
docker compose down -v   # remove containers + named volumes
```

## Use it effectively

- Edit PHP files in `app/`; changes are reflected immediately via bind mount.
- Keep DB credentials in `.env` and align app config accordingly.
- Use `down -v` only when you want a clean database reset.

## Notes

- Compose file currently hardcodes some app DB env values in `web`; keep these in sync with `.env` values.
- MySQL healthcheck uses root password; mismatched values can delay `web` startup.
