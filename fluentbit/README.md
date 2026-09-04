# Fluent Bit

Fluent Bit is a lightweight log processor and forwarder.  
It collects, parses, and routes logs to various destinations (stdout, Elasticsearch, Loki, S3, etc.).

## How Fluent Bit works

```mermaid
flowchart LR
    App([Application]) -->|logs| Volume[./logs]
    Volume --> FB[Fluent Bit]
    FB --> Stdout[stdout]
    FB --> ES[Elasticsearch]
    FB --> Loki[Loki]
    FB --> S3[S3 / File]
    Monitor([Monitor]) -->|:2020| FB
```

1. Applications write log files to a shared volume.
2. Fluent Bit tails log files using the `tail` input plugin.
3. Logs are parsed, filtered, and routed to configured outputs.
4. The built-in HTTP server on port 2020 exposes health and metrics endpoints.

## Stack details in this repo

- Image: `fluent/fluent-bit:latest`
- Container name: `fluent-bit`
- Monitoring port: `2020`
- Config mount: `./fluent-bit/fluent-bit.conf`
- Log input: `./logs` (read-only)

## Environment variables

Set via `.env` (copy from `.env.example`):

- `FLUENTBIT_PORT` (default: `2020`)

## How to run

From the repository root:

```bash
cd fluentbit
cp .env.example .env
mkdir -p logs
docker compose up -d
```

Generate test logs:

```bash
echo '{"time":"2026-05-21T10:00:00.000","level":"info","msg":"hello fluent-bit"}' >> logs/app.log
```

Check health:

```bash
curl http://localhost:2020/api/v1/health
```

View metrics:

```bash
curl http://localhost:2020/api/v1/metrics
```

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Use it effectively

- Edit `fluent-bit/fluent-bit.conf` to add outputs (Elasticsearch, Loki, S3, Kafka, Splunk, etc.).
- Use filters to enrich, modify, or drop log records before forwarding.
- Mount additional log paths from other containers using shared volumes.
- Pair with Prometheus to scrape the `/api/v1/metrics/prometheus` endpoint.

### Splunk Integration

Fluent Bit can forward logs to Splunk via the **Splunk output plugin** using the HTTP Event Collector (HEC):

```mermaid
flowchart LR
    App([Application]) -->|logs| FB[Fluent Bit :2020]
    FB -->|Tail/Forward| Parse[Parse/Filter]
    Parse -->|Splunk Output| HEC[Splunk HEC :8088]
    HEC --> Index[(Splunk Index)]
    Index --> UI[Splunk Web UI :8083]
    
    subgraph FB["Fluent Bit"]
        Parse
    end
    
    subgraph Splunk["Splunk"]
        HEC
        Index
        UI
    end
```

1. Applications write logs to files or stdout.
2. Fluent Bit collects, parses, and forwards logs using the Splunk output plugin.
3. Logs are sent to Splunk's HEC endpoint on port `8088`.
4. Splunk indexes the data for search, analysis, and visualization.

```ini
[OUTPUT]
    Name         splunk
    Match        *
    Host         <splunk-host>
    Port         8088
    Splunk_Token <YOUR_HEC_TOKEN>
    Tls          Off
    Index        main
```

1. Enable HEC in Splunk (**Settings > Data Inputs > HTTP Event Collector**).
2. Generate an HEC token and configure it in Fluent Bit.
3. Fluent Bit forwards logs to Splunk's HEC endpoint on port `8088`.

See the [Splunk Integration Guide](./../splunk/README.md) for full setup details.

## Notes

- The default config outputs to stdout for quick testing — add real outputs for production use.
- Fluent Bit is extremely lightweight (~450KB) compared to Fluentd or Logstash.
- Place your application log files in `./logs/` and they will be tailed automatically.
- See [Fluent Bit docs](https://docs.fluentbit.io/) for full plugin and configuration reference.
