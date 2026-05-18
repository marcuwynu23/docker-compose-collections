# Grafana + Prometheus + Node (VPS or VMs)

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

## Recommended Grafana Dashboard

This setup works well with Grafana dashboard **ID: 1860 (Node Exporter Full)**.

- Dashboard: [https://grafana.com/grafana/dashboards/1860](https://grafana.com/grafana/dashboards/1860)
- Use it to monitor:
  - CPU usage
  - Memory usage
  - Disk I/O
  - Network traffic
  - System load

### How to import

1. Open Grafana → Dashboards → Import
2. Enter ID: `1860`
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
cd grafana-prometheus-node
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

## Link VPS / VMs metrics (Node Exporter)

To monitor a VPS or VM, use **Node Exporter** on port `9100`.

Install Node Exporter on your VPS/VM:

```bash
wget https://github.com/prometheus/node_exporter/releases/latest/download/node_exporter-*.linux-amd64.tar.gz
```

Extract and run (example):

```bash
tar -xvf node_exporter-*.linux-amd64.tar.gz
cd node_exporter-*.linux-amd64
./node_exporter
```

By default it exposes metrics on:

- `http://<vps-ip>:9100/metrics`

### Prometheus scrape config

Update `prometheus/prometheus.yml`:

```yaml
- job_name: "vps-vms"
  static_configs:
    - targets: ["vps-or-vm:9100"]
```

Guidelines:

- Replace `vps-or-vm` with your actual server IP or hostname.
- Ensure port `9100` is accessible (firewall/security group).
- Node Exporter must be running on the VPS/VM.
- Restart Prometheus after config changes:

```bash
docker compose restart prometheus
```

## Notes

- Change default Grafana credentials before exposing this stack.
- You can add additional scrape targets in `prometheus/prometheus.yml`.
- Using Grafana dashboard **1860** is strongly recommended for system-level monitoring.
