# Grafana + Loki + Promtail (Logs Observability)

This stack gives you a working “app → logs → Loki → Grafana Explore” pipeline.

It ships logs from an example app into Loki using Promtail, then lets you query them in Grafana.

## What you get

- **Grafana**: UI for Explore/dashboards
- **Loki**: log store + query engine
- **Promtail**: log shipper (tails files and pushes to Loki)
- **App**: an Express sample that writes logs to a shared volume

## How logs flow (this repo’s setup)

1. The `app` container writes to `/var/log/express/app.log`.
2. That path lives on a named volume: `express-logs`.
3. The `promtail` container mounts the same volume read-only at `/var/log/express`.
4. Promtail tails `*.log` files and pushes entries to Loki at `http://loki:3100/loki/api/v1/push`.
5. Grafana queries Loki and shows results in **Explore**.

## Stack details in this repo

- **Grafana**: `http://<host-ip>:3000` (default)
- **Loki**: `http://<host-ip>:3100` (default)
- **App**: `http://<host-ip>:3002` (optional demo app)
- **Promtail**: runs as a sidecar shipper (no published port needed)

Default ports/credentials come from `.env` (see `.env.example`):

- `GRAFANA_PORT` (default `3000`)
- `LOKI_PORT` (default `3100`)
- `GF_SECURITY_ADMIN_USER` / `GF_SECURITY_ADMIN_PASSWORD` (default `admin` / `admin`)

Persistent data:

- `loki_data`: Loki chunks/index on filesystem
- `grafana_data`: Grafana DB/dashboards
- `express-logs`: the app’s log files (Promtail reads from here)

## Before you start

- Install **Docker Compose** *or* **Podman + podman-compose**.
- Make sure your engine is running:
  - Docker Desktop: start Docker Desktop
  - Podman: `podman machine start` (if you’re using a Podman VM)

## How to run

From the repository root:

### Docker

```bash
cd grafana-loki-promtail
cp .env.example .env
docker compose up -d
```

### Podman

```bash
cd grafana-loki-promtail
cp .env.example .env
podman compose up -d
```

Open:

- Grafana: `http://localhost:3000`
- (Optional) App: `http://localhost:3002`

## Configure Grafana (add Loki datasource)

1. Open Grafana: `http://localhost:3000`
2. Login (defaults): `admin` / `admin`
3. Go to `Connections` → `Data sources` → `Add data source`
4. Choose **Loki**
5. Set **URL** to `http://loki:3100`
6. Click **Save & test**

Why that URL works: Grafana is inside the same compose network, so it can reach the Loki container by service name `loki`.

## Verify Promtail is shipping logs

Promtail is configured in `promtail/promtail-config.yml` to tail:

- `__path__: /var/log/express/*.log`

and attach labels:

- `job="express"`
- `app="api"`

You can also check Promtail logs:

```bash
podman logs --tail 50 promtail
```

You should see it “Adding target” for `/var/log/express/*.log` and “tail routine: started” for `app.log`.

## Generate test traffic (Artillery)

This repo includes Artillery scripts under `artillery/` that generate HTTP traffic against the demo app (`http://localhost:3002`).

### Basic test

Use `artillery/basic.yml` for a quick sanity check.

What it does:

- Runs for **60 seconds**
- Sends **~10 new users/second**
- Hits `GET /` and `GET /api/health`

```bash
npx -y artillery run artillery/basic.yml
```

### Stress test

Use `artillery/stress.yml` to generate a larger burst (warm up → ramp up → sustain high load).

```bash
npx -y artillery run artillery/stress.yml
```

### Alternative: global install

```bash
npm i -g artillery
artillery run artillery/basic.yml
```

While it’s running, open Grafana Explore and watch logs appear for `{job="express"}`.

## Explore logs in Grafana (LogQL examples)

Go to `Explore`, select the **Loki** datasource, then try:

All app logs:

```logql
{job="express"}
```

Only this app instance (same, but explicit):

```logql
{job="express", app="api"}
```

Filter by text:

```logql
{job="express"} |= "error"
```

Rate/count examples:

```logql
sum(count_over_time({job="express"} [5m]))
```

Requests per second (approx) over the last minute:

```logql
sum(rate({job="express"}[1m]))
```

```logql
sum(count_over_time({job="express"} |= "error" [5m]))
```

If you enabled the JSON parsing pipeline stages, you can filter by extracted label (e.g. `level`) once it exists:

```logql
{job="express", level="error"}
```

## Dashboards (optional)

In Grafana:

1. `Dashboards` → `New` → `Import`
2. Paste a dashboard ID (or JSON)
3. Select your Loki datasource
4. Import and save

Community dashboards that are often useful:

- `13639` (Loki logs quick start)
- `15141` (Kubernetes logs with Loki; adaptable for generic logs)

> Dashboard availability can change over time. If an ID is unavailable, search Grafana Dashboards for “Loki”.

## Troubleshooting

### “volume [X] not defined in top level” (podman-compose)

`podman-compose` is strict: if a named volume is used under a service, it must also be declared under top-level `volumes:`.

This stack defines:

- `express-logs`
- `loki_data`
- `grafana_data`

### “no logs” / “no logs volume available”

Most commonly:

- **Promtail is tailing a path that doesn’t exist inside the container**, or
- you mounted a **Linux host path** like `/var/log` while running on Windows.

In this repo we avoid host `/var/log` and instead share a named volume (`express-logs`) between `app` and `promtail`.

### Promtail is running but nothing shows in Grafana

Check these in order:

- **Datasource URL** in Grafana is `http://loki:3100` (not `localhost`)
- Promtail can reach Loki (`clients.url` points to `http://loki:3100/...`)
- Promtail sees the file target `/var/log/express/app.log`
- Your query matches the labels. Start with:

```logql
{job="express"}
```

### Positions file keeps changing / git diffs

Promtail stores offsets in `promtail/positions/positions.yaml` so it doesn’t re-read files on restart. It’s intentionally ignored by git in this repo.
