# Prometheus + Grafana + MongoDB

This stack provides basic monitoring and visualization using Prometheus and Grafana.
Prometheus collects metrics and Grafana renders dashboards from Prometheus data.

## How it works

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

## MongoDB Monitoring (Exporter)

This stack uses **mongodb_exporter** to expose MongoDB metrics to Prometheus.

No manual installation is required when using Docker Compose.

```yaml id="3s0r6x"
mongodb-exporter:
  image: percona/mongodb_exporter:0.40
  container_name: mongodb-exporter
  restart: always
  command:
    - "--mongodb.uri=mongodb://192.168.1.10:27017"
  ports:
    - "9216:9216"
```

If MongoDB Requires Authentication

```yml
command:
  - "--mongodb.uri=mongodb://username:password@192.168.1.10:27017/admin"
```

Example:

```yml
command:
  - "--mongodb.uri=mongodb://root:secret123@192.168.1.10:27017/admin"
```

## Prometheus scrape config (MongoDB)

Update `prometheus/prometheus.yml`:

```yaml
- job_name: "mongodb"
  static_configs:
    - targets: ["mongodb-exporter:9216"]
```

Guidelines:

- Replace `mongodb-exporter` with actual host or container name.
- Ensure port `9216` is reachable.
- MongoDB exporter must be running and connected to MongoDB.
- Restart Prometheus after config changes:

```bash
docker compose restart prometheus
```

## Recommended Grafana Dashboard

Use this MongoDB monitoring dashboard:

- Dashboard: [https://github.com/marcuwynu23/grafana-dashboard-collections/blob/main/mongodb-dashboard-and-monitoring/mongodb-dashboard-and-monitoring.json](https://github.com/marcuwynu23/grafana-dashboard-collections/blob/main/mongodb-dashboard-and-monitoring/mongodb-dashboard-and-monitoring.json)

### How to import

1. Open Grafana → Dashboards → Import
2. Paste the JSON from the link above
3. Select Prometheus datasource
4. Click Import

## Environment variables

Copy `.env.example` to `.env`:

- `GF_SECURITY_ADMIN_USER`
- `GF_SECURITY_ADMIN_PASSWORD`
- `GF_USERS_ALLOW_SIGN_UP`

## How to run

From the repository root:

```bash
cd grafana-prometheus-mongodb
cp .env.example .env
docker compose up -d
```

Open:

- Prometheus: `http://localhost:9090`
- Grafana: `http://localhost:3000`

## Useful commands

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Notes

- Change default Grafana credentials before exposing this stack.
- Ensure MongoDB exporter is secured (do not expose 9216 publicly).
- You can add additional scrape targets in `prometheus/prometheus.yml`.
