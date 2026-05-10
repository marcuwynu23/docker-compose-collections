# Elasticsearch + Kibana + Filebeat + App Logs Stack

This stack provides a simple observability pipeline:

**App → Filebeat → Elasticsearch → Kibana**

It collects logs from an Express application, ships them using Filebeat, stores them in Elasticsearch, and visualizes them in Kibana.

---

## Architecture

```
[ Express App ]
      ↓ writes logs
/var/log/express/app.log (Docker volume)
      ↓
[ Filebeat ]
      ↓ ships logs
[ Elasticsearch ]
      ↓ indexed data
[ Kibana ]
      ↓ UI / Search / Dashboards
```

---

## Services

### Elasticsearch

- Stores and indexes logs
- Runs in single-node mode (dev setup)
- Security disabled for simplicity

Ports:

- 9200 → REST API
- 9300 → cluster transport

---

### Kibana

- Web UI for searching logs
- Connected to Elasticsearch

URL:

```
http://localhost:5601
```

---

### App (Express + TypeScript)

- Generates HTTP logs
- Writes logs to a shared volume

URL:

```
http://localhost:5000
```

Logs are written to:

```
/var/log/express/app.log
```

---

### Filebeat

- Lightweight log shipper
- Reads app log file from shared volume
- Sends logs to Elasticsearch

---

## How to Run

```bash
docker compose up -d
```

Check services:

```bash
docker ps
```

---

## Access Points

- App: [http://localhost:5000](http://localhost:5000)
- Elasticsearch: [http://localhost:9200](http://localhost:9200)
- Kibana: [http://localhost:5601](http://localhost:5601)

---

## Kibana Setup (First Time)

1. Open Kibana:

   ```
   http://localhost:5601
   ```

2. Go to:

   ```
   Stack Management → Data Views
   ```

3. Create Data View:

   ```
   filebeat-*
   ```

4. Set time field:

   ```
   @timestamp
   ```

5. Go to:

   ```
   Discover
   ```

You should now see logs from the app.

---

## Example Query in Kibana

All logs:

```
filebeat-*
```

Filter by HTTP method:

```
http.request.method: "GET"
```

Filter errors:

```
log.level: "error"
```

---

## Live Log Updates (Real-time)

Kibana supports near real-time logs:

1. Go to Discover
2. Select `filebeat-*`
3. Enable Auto-refresh (5s or 10s)

---

## Why Filebeat instead of Promtail?

| Tool     | Ecosystem     | Purpose                    |
| -------- | ------------- | -------------------------- |
| Filebeat | Elastic Stack | Ship logs to Elasticsearch |
| Promtail | Grafana Loki  | Ship logs to Loki          |

Filebeat → Elasticsearch ecosystem
Promtail → Loki ecosystem

---

## Is Filebeat like Prometheus?

No.

- Filebeat / Promtail → log shippers
- Prometheus → metrics system

| Type       | Tool                |
| ---------- | ------------------- |
| Logs       | Filebeat / Promtail |
| Metrics    | Prometheus          |
| Logs UI    | Kibana / Grafana    |
| Metrics UI | Grafana             |

---

## Making Logs “Live”

### 1. Kibana auto-refresh

Set interval to:

```
5s or 10s
```

### 2. Generate traffic

```bash
curl http://localhost:5000/
curl http://localhost:5000/anything
```

### 3. Watch Discover tab

Logs appear in near real-time

---

## Troubleshooting

### No logs in Kibana

```bash
docker logs filebeat -f
```

Check Filebeat is reading:

```
/var/log/express/app.log
```

---

### Elasticsearch empty index

```bash
curl http://localhost:9200/_cat/indices?v
```

Expected:

```
filebeat-*
```

---

### Kibana shows no data

- Data view must be `filebeat-*`
- Time range must be correct

---

## Key Concept

App → Filebeat → Elasticsearch → Kibana

Auto-refresh in Kibana gives live log streaming experience.

---

## Optional Improvements

- Add JSON structured logging
- Add Filebeat parsing pipelines
- Add Kibana dashboards
- Add alerting rules
