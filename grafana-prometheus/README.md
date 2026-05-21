# Grafana + Prometheus

This stack provides basic monitoring and visualization using Prometheus and Grafana.  
Prometheus collects metrics and Grafana renders dashboards from Prometheus data.

## How it works

```mermaid
flowchart LR
    App([App / Exporter]) --> Prometheus[Prometheus :9090]
    Prometheus --> Data[(Time-Series DB)]
    Grafana[Grafana :3000] --> Prometheus
    User([User]) --> Grafana
```

1. Prometheus starts with local scrape config from `prometheus/prometheus.yml`.
2. Prometheus stores time-series metrics in persistent storage.
3. Grafana auto-loads a Prometheus datasource via provisioning.
4. You query and visualize metrics in Grafana dashboards.

## Stack details in this repo

- Prometheus image: `prom/prometheus:latest`
- Grafana image: `grafana/grafana:latest`
- Prometheus UI: `http://<host-ip>:9090`
- Grafana UI: `http://<host-ip>:3000`
- Persistent data:
  - `prometheus_data:/prometheus`
  - `grafana_data:/var/lib/grafana`
- Mounted config:
  - `./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml`
  - `./grafana/provisioning:/etc/grafana/provisioning`

## Environment variables

Copy `.env.example` to `.env`:

- `GF_SECURITY_ADMIN_USER`
- `GF_SECURITY_ADMIN_PASSWORD`
- `GF_USERS_ALLOW_SIGN_UP`

## How to run

From the repository root:

```bash
cd grafana-prometheus
cp .env.example .env
docker compose up -d
```

Open:

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000`

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Link app server metrics

To scrape metrics from your app server, add a target in `prometheus/prometheus.yml`:

```yaml
- job_name: "api-server"
  static_configs:
    - targets: ["api-server:8080"]
```

Guidelines:

- Ensure your app exposes a Prometheus endpoint (typically `/metrics`).
- If your app is in Docker Compose, use the service name and container port (for example `api-server:8080`).
- If your app runs outside Docker, use a reachable host/IP and port.
- Restart Prometheus after config changes:

```bash
docker compose restart prometheus
```

## Notes

- Change default Grafana credentials before exposing this stack.
- You can add additional scrape targets in `prometheus/prometheus.yml`.
