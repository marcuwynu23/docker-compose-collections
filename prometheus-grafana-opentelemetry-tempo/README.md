# Grafana + OpenTelemetry + Tempo

This stack provides distributed tracing and metrics visualization using OpenTelemetry, Tempo, and Grafana.  
The OpenTelemetry Collector receives traces from applications, exports them to Tempo for storage, and derives span metrics exposed via a Prometheus-compatible endpoint.

## How it works

1. The sample application sends traces to the OpenTelemetry Collector via OTLP (gRPC/HTTP).
2. OpenTelemetry Collector batches and exports traces to Tempo.
3. The `spanmetrics` connector derives RED metrics (Rate, Errors, Duration) from traces.
4. Derived metrics are exposed on port `8889` in Prometheus format.
5. Tempo stores traces and serves them to Grafana for querying.
6. Grafana auto-loads Tempo datasource via provisioning for trace visualization.

## Stack details in this repo

| Service                 | Image                                                  | Port(s)                |
| ----------------------- | ------------------------------------------------------ | ---------------------- |
| Application             | `ghcr.io/marcuwynu23/express-typescript-sample:latest` | `5000`                 |
| OpenTelemetry Collector | `otel/opentelemetry-collector-contrib:latest`          | `4317`, `4318`, `8889` |
| Tempo                   | `grafana/tempo:latest`                                 | `3200`                 |
| Grafana                 | `grafana/grafana:latest`                               | `3000`                 |

- Persistent data:
  - `grafana_data:/var/lib/grafana`
  - `tempo_data:/tmp/tempo`
  - `express-logs:/var/log/express`
- Mounted config:
  - `./grafana/provisioning:/etc/grafana/provisioning`
  - `./opentelemetry/otel-config.yaml:/etc/otel-collector-config.yaml`
  - `./tempo/tempo.yaml:/etc/tempo.yaml`

## Environment variables

Configured directly in `docker-compose.yml`:

- `GF_SECURITY_ADMIN_USER` — Grafana admin username (default: `admin`)
- `GF_SECURITY_ADMIN_PASSWORD` — Grafana admin password (default: `admin`)
- `OTEL_EXPORTER_OTLP_ENDPOINT` — OTel Collector HTTP endpoint for the app
- `OTEL_EXPORTER_OTLP_TRACES_ENDPOINT` — OTel Collector traces endpoint
- `OTEL_EXPORTER_OTLP_PROTOCOL` — OTLP export protocol (`http/protobuf`)
- `OTEL_LOG_LEVEL` — OpenTelemetry log level (`debug`)

## How to run

From the repository root:

```bash
cd grafana-opentelemetry-tempo
docker compose up -d
```

Open:

- Grafana: `http://localhost:3000` (login: `admin` / `admin`)
- Tempo: `http://localhost:3200`
- Application: `http://localhost:5000`
- OTel Metrics: `http://localhost:8889/metrics`

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Link your application traces

### Configure your app to send traces

Set these environment variables in your application service:

```yaml
environment:
  OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4318
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: http://otel-collector:4318/v1/traces
  OTEL_EXPORTER_OTLP_PROTOCOL: http/protobuf
```

Or for gRPC:

```yaml
environment:
  OTEL_EXPORTER_OTLP_ENDPOINT: http://otel-collector:4317
  OTEL_EXPORTER_OTLP_PROTOCOL: grpc
```

### Add your service to the Docker network

Ensure your application is on the `monitoring` network:

```yaml
services:
  my-app:
    image: my-app:latest
    networks:
      - monitoring
    depends_on:
      - otel-collector
```

## Architecture overview

```
┌─────────────┐         ┌──────────────────────┐
│ Application │──traces──▶ OpenTelemetry        │
│  (Express)  │         │ Collector             │
└─────────────┘         └───┬──────────┬────────┘
                            │          │
                       traces│     span metrics
                            │      (port 8889)
                            ▼          │
                     ┌───────────┐     │
                     │   Tempo   │     │
                     └─────┬─────┘     │
                           │           │
                           ▼           ▼
                    ┌──────────────────────────┐
                    │         Grafana           │
                    │   (Tempo + Prometheus)    │
                    └──────────────────────────┘
```

## Notes

- Change default Grafana credentials before exposing this stack externally.
- This stack focuses on **tracing** — no dedicated Prometheus or Loki services are included.
- The OTel Collector exposes span-derived metrics on port `8889` in Prometheus format, which can be scraped by an external Prometheus instance if needed.
- Tempo stores traces locally — for production, consider object storage backends (S3, GCS).
- The `spanmetrics` connector generates RED metrics (Rate, Errors, Duration) from all received traces.
- Restart services after config changes:

```bash
docker compose restart otel-collector  # After otel-config.yaml changes
docker compose restart grafana         # After provisioning changes
```
