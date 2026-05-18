# Grafana + Prometheus (Kubernetes Metrics)

This stack provides monitoring and visualization for Kubernetes-related metrics.  
Prometheus collects and stores metrics, while Grafana reads from Prometheus and renders dashboards.

## How it works

1. Prometheus scrapes metrics targets configured in `prometheus/prometheus.yml`.
2. Metrics are stored in Prometheus time-series storage.
3. Grafana connects to Prometheus as a datasource.
4. You explore metrics through Grafana dashboards and queries.

## Stack details in this repo

- Prometheus image: `prom/prometheus:latest`
- Grafana image: `grafana/grafana:latest`
- Prometheus UI: `http://<host-ip>:9090`
- Grafana UI: `http://<host-ip>:3000`
- Persistent data:
  - `prometheus_data:/prometheus`
  - `grafana_data:/var/lib/grafana`
- Mounted config/files:
  - `./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml`
  - `./token.txt:/etc/prometheus/token.txt:ro`

## Environment variables

Set via `.env` (copy from `.env.example`):

- `GF_SECURITY_ADMIN_USER` (default: `admin`)
- `GF_SECURITY_ADMIN_PASSWORD` (default: `admin`)
- `GF_USERS_ALLOW_SIGN_UP` (default: `false`)

## How to run

From the repository root:

```bash
cd grafana-prometheus-kubenetes
cp .env.example .env
docker compose up -d
```

Open:

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000`

Use the Grafana admin credentials from your `.env`.

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Use it effectively

- Validate scrape targets in Prometheus (`Status -> Targets`).
- Add/import Grafana dashboards for Kubernetes components.
- Keep `token.txt` secure because it may contain cluster access credentials.

## Notes

- Ensure `prometheus/prometheus.yml` has reachable targets from this Docker host.
- Change default Grafana password before exposing the stack externally.
