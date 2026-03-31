# Elasticsearch (Docker Compose)

Elasticsearch is a distributed search and analytics engine for structured and unstructured data.  
This setup runs a single-node Elasticsearch instance for local/dev usage.

## How it works

1. Elasticsearch node starts with configuration from environment variables.
2. HTTP API is exposed on port `9200`.
3. Transport port `9300` is available for node communication use cases.
4. Index data is persisted in a named Docker volume.

## Stack details in this repo

- Image: `docker.elastic.co/elasticsearch/elasticsearch:8.11.0`
- Container name: `elasticsearch`
- Ports:
  - `9200` (REST API)
  - `9300` (transport)
- Persistent data:
  - `es_data:/usr/share/elasticsearch/data`
- Network: `esnet`

## Environment variables

Copy `.env.example` to `.env` and adjust:

- `ES_NODE_NAME`
- `ES_CLUSTER_NAME`
- `ES_DISCOVERY_TYPE`
- `ES_BOOTSTRAP_MEMORY_LOCK`
- `ES_JAVA_OPTS`
- `ES_XPACK_SECURITY_ENABLED`

## How to run

From the repository root:

```bash
cd elasticsearch
cp .env.example .env
docker compose up -d
```

Test endpoint:

```bash
curl http://localhost:9200
```

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Notes

- This config is single-node (`discovery.type=single-node`) for local use.
- Tune `ES_JAVA_OPTS` according to host memory.
