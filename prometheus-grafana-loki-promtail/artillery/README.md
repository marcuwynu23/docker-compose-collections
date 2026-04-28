# Artillery Load Testing Guide

This project uses Artillery to perform load testing and stress testing on your backend API.

It includes two main test profiles:

- basic.yml → Functional + light load testing
- stress.yml → High load + stress testing

---

# Installation

Install Artillery globally:

```bash
npm install -g artillery
```

Verify installation:

```bash
artillery -V
```

---

# Project Structure

```
.
├── basic.yml
├── stress.yml
└── README.md
```

---

# Basic Load Test

File: basic.yml

Purpose:

- Validate API endpoints
- Light load simulation
- Detect early issues

Config:

- Target: [http://localhost:3002](http://localhost:3002)
- Duration: 60 seconds
- Load: 10 requests per second

Scenarios tested:

- GET /
- GET /api/health

Run Basic Test:

```bash
artillery run basic.yml
```

Expected Output:

- Response time (latency)
- Request success rate
- Errors (if any)
- Throughput (requests/sec)

---

# Stress Test

File: stress.yml

Purpose:

- Simulate real-world traffic spikes
- Identify system breaking points
- Test scalability and stability

Phases Breakdown:

1. Warm Up

- 60 seconds
- 10 users/sec

2. Ramp Up

- 120 seconds
- 20 → 200 users/sec

3. Sustained Load

- 60 seconds
- 300 users/sec constant load

Scenarios tested:

- GET /
- GET /api/health
- Both endpoints must return 200 OK

Run Stress Test:

```bash
artillery run stress.yml
```

---

# Metrics You Should Watch

Backend:

- CPU usage
- Memory usage
- Event loop delay (Node.js)
- DB connections

API:

- Response time (p95 / p99)
- Error rate
- Timeout rate

System:

- Network bandwidth
- Disk I/O (if logging enabled)

---

# Important Notes

1. Do NOT run on production
   Stress tests can crash services, exhaust DB connections, and overload CPU/RAM.

2. Tune limits before testing

- DB connection pool configured
- Rate limits understood
- Logging optimized

3. Run monitoring alongside
   Recommended tools:

- Prometheus
- Grafana
- Loki

---

# Tips for Better Testing

Start small:
arrivalRate: 1 → 5 → 10 → 50 → 100

Watch failure point:

- First slowdown
- First error spike
- CPU saturation

---

# Example Use Cases

- API performance benchmarking
- CI/CD performance regression tests
- Load capacity planning
- Microservice stress validation

---

# Example Workflow

```bash
# Step 1: Start backend
npm run dev

# Step 2: Run basic test
artillery run basic.yml

# Step 3: Run stress test
artillery run stress.yml

# Step 4: Check Grafana dashboards
```

---

# Output Reports (Optional)

Generate HTML report:

```bash
artillery run stress.yml --output report.json
artillery report report.json
```

---

# Summary

| Test Type  | Purpose                   | Load |
| ---------- | ------------------------- | ---- |
| basic.yml  | Functional + sanity check | Low  |
| stress.yml | Breakpoint testing        | High |

---

# Recommendation

Always run:

1. Basic test first
2. Then stress test
3. Then analyze logs + metrics (Grafana + Loki)
