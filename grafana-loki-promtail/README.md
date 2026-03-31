# Grafana + Loki + Promtail

This stack provides centralized log collection and visualization.

## How it works

1. Promtail scrapes log files from host paths.
2. Loki ingests and indexes logs.
3. Grafana queries Loki and visualizes logs in dashboards/explore.

## Stack details in this repo

- `loki` on port `3100`
- `promtail` for log shipping
- `grafana` on port `3001` (default)

## How to run

```bash
cd grafana-loki-promtail
cp .env.example .env
docker compose up -d
```

## Add Loki in Grafana

1. Open Grafana: `http://localhost:3001`
2. Login (default from `.env`: `admin` / `admin`)
3. Go to `Connections` -> `Data sources` -> `Add data source` -> `Loki`
4. Set URL to:
   - `http://loki:3100`
5. Click `Save & test`

## Monitor logs in Explore

Go to `Explore`, select `Loki`, then run queries:

```logql
{job="varlogs"}
```

```logql
{job="varlogs"} |= "error"
```

```logql
{job="varlogs"} |= "warn"
```

Count error logs over 5 minutes:

```logql
sum(count_over_time({job="varlogs"} |= "error" [5m]))
```

## Add dashboards

In Grafana:

1. Go to `Dashboards` -> `New` -> `Import`
2. Use a community dashboard ID (or JSON)
3. Select your Loki data source
4. Import and save

Common dashboard IDs to try:

- `13639` (Loki logs quick start)
- `15141` (Kubernetes logs with Loki, adaptable for generic logs)

> Dashboard availability can change over time; if an ID is unavailable, search Grafana Dashboards for "Loki" and import an active one.

## Notes

- Add Loki data source in Grafana: `http://loki:3100`.
- Adjust promtail scrape paths to match your host/container logs.
