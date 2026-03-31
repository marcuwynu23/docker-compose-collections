# Prometheus + Grafana (Proxmox Monitoring)

This stack monitors Proxmox VE using Prometheus and Grafana.  
A Proxmox exporter exposes metrics, Prometheus scrapes them, and Grafana visualizes the data.

## How it works

1. `proxmox-exporter` connects to your Proxmox API using credentials from `.env`.
2. The exporter exposes Prometheus metrics on port `9221`.
3. Prometheus scrapes exporter metrics and stores them.
4. Grafana reads metrics from Prometheus and displays dashboards.

## Stack details in this repo

- Prometheus image: `prom/prometheus:latest`
- Proxmox exporter image: `prompve/prometheus-pve-exporter:latest`
- Grafana image: `grafana/grafana:latest`
- UIs/ports:
  - Prometheus: `http://<host-ip>:9090`
  - Grafana: `http://<host-ip>:3000`
  - Exporter metrics: `http://<host-ip>:9221/metrics`
- Persistent data:
  - `prometheus_data:/prometheus`
  - `grafana_data:/var/lib/grafana`
- Mounted config:
  - `./prometheus/prometheus.yml:/etc/prometheus/prometheus.yml`
  - `./grafana/provisioning:/etc/grafana/provisioning`

## Environment variables

Set in `.env`:

- `PVE_USER`
- `PVE_TOKEN_NAME`
- `PVE_TOKEN_VALUE`
- `PVE_VERIFY_SSL` (commonly `false` in lab setups)
- `PVE_HOST`
- `GF_SECURITY_ADMIN_USER`
- `GF_SECURITY_ADMIN_PASSWORD`
- `GF_USERS_ALLOW_SIGN_UP`

Defaults for Grafana are shown in `.env.example`.

## How to run

From the repository root:

```bash
cd prometheus-grafana-proxmox
cp .env.example .env
# Fill in Proxmox values in .env before starting
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

## Use it effectively

- Confirm exporter health at `http://localhost:9221/metrics`.
- In Prometheus, verify exporter target status is `UP`.
- Import Proxmox dashboards in Grafana for VM/node visibility.

## Notes

- Prefer API tokens over passwords for Proxmox access.
- Restrict `.env` permissions because it contains sensitive credentials.
