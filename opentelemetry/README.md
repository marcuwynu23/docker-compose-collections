# OpenTelemetry + Prometheus + Jaeger (Podman Compose)

This project runs a minimal observability stack with:

- **OpenTelemetry Collector** for ingesting traces and generating span-based metrics.
- **Prometheus** for scraping and storing metrics.
- **Jaeger UI** for viewing distributed traces and SPM (Monitor tab).
- **Telemetrygen** for generating synthetic trace traffic (`service.name=otel-demo`).

## What Each Component Does

- **OpenTelemetry (OTel Collector)**
  - Receives OTLP traces on port `4317`.
  - Uses the `spanmetrics` connector to convert traces into RED-style metrics (rate, errors, duration).
  - Exposes metrics for Prometheus on port `8889`.
  - Exports traces to Jaeger so they can be searched in Jaeger UI.

- **Prometheus**
  - Scrapes `otel-collector:8889`.
  - Stores time-series metrics, including spanmetrics from OTel.
  - Acts as Jaeger SPM metrics backend.

- **Jaeger UI**
  - Trace exploration UI at `http://localhost:16686`.
  - **Monitor** tab uses Prometheus metrics (via Jaeger config) to show service performance metrics.

## Architecture Flow

1. `tracegen` creates synthetic spans with `service.name=otel-demo`.
2. Spans are sent to `otel-collector` via OTLP (`otel-collector:4317`).
3. OTel Collector:
   - forwards traces to Jaeger (`jaeger:4317`);
   - converts traces to spanmetrics via `spanmetrics`;
   - exposes metrics at `:8889` for Prometheus.
4. Prometheus scrapes `otel-collector:8889` and stores metrics.
5. Jaeger Monitor reads metrics from Prometheus and renders SPM charts.

## Services and Ports

- `otel-collector`
  - OTLP gRPC: `4317`
  - Prometheus exporter: `8889`
- `prometheus`
  - UI/API: `9090`
- `jaeger`
  - UI: `16686`

## Run

```bash
podman compose up -d --remove-orphans
```

## Verify

1. Check containers:
   ```bash
   podman compose ps
   ```
2. Open UIs:
   - Jaeger: `http://localhost:16686`
   - Jaeger Monitor: `http://localhost:16686/monitor`
   - Prometheus: `http://localhost:9090`
3. In Prometheus, test queries:
   - `up{job="otel-collector"}`
   - `sum by (service_name) (traces_span_metrics_duration_milliseconds_count)`
4. In Jaeger:
   - **Search**: service `otel-demo`
   - **Monitor**: confirm service metrics appear (allow ~30-90 seconds after startup)

## Notes

- Volume mounts use `:Z` for Podman SELinux compatibility.
- If Jaeger Monitor appears empty right after startup, wait for:
  - OTel spanmetrics flush interval, and
  - Prometheus scrape interval.
