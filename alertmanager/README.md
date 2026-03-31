# Alertmanager

This stack provides Prometheus Alertmanager, which handles alert grouping, deduplication, silencing, and routing to notification channels.

## How it works

1. `alertmanager` loads routing config from `alertmanager/alertmanager.yml`.
2. Prometheus sends firing alerts to Alertmanager.
3. Alertmanager groups alerts and forwards them to configured receivers (email, Slack, webhook, etc.).

## Stack details in this repo

- Service:
  - `alertmanager` (`prom/alertmanager:latest`)
- Ports:
  - Alertmanager UI/API: `http://localhost:9093`
- Config mount:
  - `./alertmanager/alertmanager.yml:/etc/alertmanager/alertmanager.yml:ro`
- Persistent data:
  - `alertmanager_data:/alertmanager`

## Environment variables

Set via `.env` (copy from `.env.example`):

- `ALERTMANAGER_PORT`

## How to run

From the repository root:

```bash
cd alertmanager
cp .env.example .env
docker compose up -d
```

Open:

- UI: `http://localhost:9093`

Useful commands:

```bash
docker compose ps
docker compose logs -f alertmanager
docker compose down
docker compose down -v
```

## Notes

- The included config is intentionally minimal and routes all alerts to a placeholder receiver.
- Edit `alertmanager/alertmanager.yml` to add real receivers (Slack/email/webhook) for your environment.
