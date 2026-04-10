# OpenProject

:contentReference[oaicite:0]{index=0} is an open-source project management tool for task tracking, team collaboration, agile workflows, and project planning.

This setup runs OpenProject using Docker with a PostgreSQL database.

---

## Stack details in this repo

- Image: `openproject/openproject:17`
- Database: `postgres:17`
- Container names:
  - `openproject`
  - `openproject-db`
- Web UI: `http://localhost:8080`
- Default internal port: `80` (mapped to `8080`)
- Persistent data:
  - `./data:/var/openproject/assets`
  - `./logs:/var/log/openproject`
  - Docker volume: `pgdata`

---

## How OpenProject works

1. User accesses the web interface via browser.
2. OpenProject connects to PostgreSQL database (`db` service).
3. Application runs background jobs using internal worker system.
4. Web server (Puma + Apache) serves UI and API.
5. Real-time features (collaboration, updates) are handled internally.

---

## Environment variables

### Required

- `SECRET_KEY_BASE`  
  Generate it using:

```bash
openssl rand -hex 64
```

- `DATABASE_URL`

```env
postgres://openproject:openproject@db:5432/openproject
```

- `OPENPROJECT_HOST__NAME`

```env
localhost:8080
```

For remote access:

```env
<your-ip>:8080
```

- `OPENPROJECT_HTTPS`

Set to "false" for local development.

Default login

After first startup:

```
Username: admin
Password: admin
```

How to run

```bash
docker compose up -d
```

Check status:

```bash
docker compose ps
```

Logs:

```bash
docker compose logs -f openproject
```

Stop:

```bash
docker compose down
```

Reset everything

```bash
docker compose down -v
docker volume prune -f
```

Access

```
http://localhost:8080
```

Notes

- PostgreSQL must be running before OpenProject starts.
- Always use a strong `SECRET_KEY_BASE`.
- Ensure port `8080` is free.
- Data is stored in `pgdata`.
