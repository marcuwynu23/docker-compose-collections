# Prometheus Documentation (grafana-prometheus-alertmanager)

This guide explains how to use Prometheus in the `grafana-prometheus-alertmanager` stack, including common PromQL queries such as `up` and practical monitoring examples.

## Access Prometheus

After starting the stack:

```bash
cd grafana-prometheus-alertmanager
docker compose up -d
```

Open Prometheus UI:

- `http://localhost:9090`

Main places in Prometheus UI:

- `Graph`: run PromQL queries
- `Status -> Targets`: verify scrape targets and health
- `Status -> Configuration`: confirm loaded config

## First checks to run

Use these queries in the **Graph** tab:

```promql
up
```

What it means:

- `1` = target is healthy and being scraped
- `0` = target is down/unreachable

Check only your app server:

```promql
up{job="api-server"}
```

Check Prometheus itself:

```promql
up{job="prometheus"}
```

## Core PromQL you will use often

### Target and scrape health

```promql
up
scrape_duration_seconds
scrape_samples_scraped
scrape_samples_post_metric_relabeling
```

### Request rate / throughput (if app exposes counters)

```promql
rate(http_requests_total[1m])
sum(rate(http_requests_total[5m]))
sum by (status) (rate(http_requests_total[5m]))
```

### Error rate

```promql
sum(rate(http_requests_total{status=~"5.."}[5m]))
/
sum(rate(http_requests_total[5m]))
```

### Latency percentiles (if histogram metrics exist)

```promql
histogram_quantile(0.50, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
histogram_quantile(0.99, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))
```

### CPU and memory examples (metric names depend on exporter)

```promql
process_cpu_seconds_total
rate(process_cpu_seconds_total[5m])
process_resident_memory_bytes
```

### Container-level examples (requires cAdvisor/node exporter)

```promql
sum(rate(container_cpu_usage_seconds_total[5m])) by (container)
sum(container_memory_working_set_bytes) by (container)
```

## Useful query patterns

### Filter by labels

```promql
up{job="api-server",instance="api-server:8080"}
```

### Group and aggregate

```promql
sum by (job) (up)
avg by (instance) (rate(http_requests_total[5m]))
```

### Top N

```promql
topk(5, rate(http_requests_total[5m]))
```

### Time offsets (compare now vs past)

```promql
rate(http_requests_total[5m])
rate(http_requests_total[5m] offset 1h)
```

## Troubleshooting

If `up{job="api-server"} == 0`:

1. Check target page: `http://localhost:9090/targets`
2. Confirm `prometheus/prometheus.yml` target uses the correct host/service and port
3. Ensure app metrics endpoint is reachable from Prometheus container
4. Restart Prometheus after config changes:

```bash
docker compose restart prometheus
```

View logs:

```bash
docker compose logs -f prometheus
```

## Suggested starter dashboard panels (Grafana)

Use these PromQL queries in Grafana panels:

- **Target health**: `up{job="api-server"}`
- **RPS**: `sum(rate(http_requests_total[1m]))`
- **Error rate**: `sum(rate(http_requests_total{status=~"5.."}[5m])) / sum(rate(http_requests_total[5m]))`
- **P95 latency**: `histogram_quantile(0.95, sum(rate(http_request_duration_seconds_bucket[5m])) by (le))`
- **Process memory**: `process_resident_memory_bytes`

## Notes

- Query names depend on metrics exposed by your application/exporter.
- If a query returns no data, verify the metric name under Prometheus `Graph` autocomplete or `/api/v1/label/__name__/values`.
