# Trivy Server + Web UI

Trivy is an open-source vulnerability scanner for container images and filesystems.

## How it works

1. Trivy server runs as a long-lived scanner API.
2. Trivy UI provides a browser-based interface for scanning.
3. Vulnerability DB/cache is stored in persistent volume.

## Stack details

- Trivy image: `aquasec/trivy:0.56.2`
- Trivy API endpoint: `http://<host-ip>:4954`
- Trivy UI image: `pointvy/pointvy:latest`
- Trivy UI endpoint: `http://<host-ip>:8085`
- Cache volume: `trivy_cache`

## How to run

```bash
cd trivy
cp .env.example .env
docker compose up -d
```

Podman:

```bash
cd trivy
cp .env.example .env
podman compose up -d
```

## How to use

### 1) Verify services are up

```bash
docker compose ps
curl http://localhost:4954/version
```

### 2) Use Trivy Web UI

Open:

- `http://localhost:8085`

Pointvy usage flow:

1. Open `http://localhost:8085`.
2. Choose scan target type (image, repository, or filesystem path, depending on UI options).
3. Enter the target (for example `alpine:latest` or `nginx:latest`).
4. Run the scan and review vulnerabilities by severity.
5. Expand findings to inspect package name, CVE ID, installed/fixed version, and references.

Tips:

- Pointvy sends scan requests to `TRIVY_SERVER` (`http://trivy:4954` in this stack).
- If UI loads but scans fail, verify Trivy server health with:

```bash
curl http://localhost:4954/version
```

- Use CLI scans for scripting/CI; use Pointvy for interactive triage.

### 3) Scan images from CLI (through server)

```bash
trivy image --server http://localhost:4954 alpine:latest
trivy image --server http://localhost:4954 nginx:latest
```

### 4) Scan local filesystem/project

```bash
trivy fs --server http://localhost:4954 .
```

### 5) Output reports

JSON output:

```bash
trivy image --server http://localhost:4954 --format json --output trivy-report.json alpine:latest
```

Only high/critical findings:

```bash
trivy image --server http://localhost:4954 --severity HIGH,CRITICAL alpine:latest
```

### 6) Keep DB/cache fresh

Trivy server auto-manages vulnerability DB updates.  
If needed, restart service to refresh behavior:

```bash
docker compose restart trivy
```

## Notes

- Scan client example:
  - `trivy image --server http://localhost:4954 alpine:latest`
- Web UI is provided by `pointvy`, a third-party frontend for Trivy.
- Feature availability in Pointvy can vary between image versions.
