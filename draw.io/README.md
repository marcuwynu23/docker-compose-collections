# Draw.io

Draw.io (diagrams.net) is a platform-independent diagramming software.
This setup runs a single-instance Draw.io container for local usage.

## How it works

1 The Draw.io container starts.

2. HTTP interface is exposed on port 8080.

3. HTTPS interface is available on port 8443.

Stack details in this repo

## Stack details in this repo

- Image: `jgraph/drawio`
- Container name: `draw.io`
- Ports:
  - `8080` (HTTP)
  - `8443` (HTTPS)

## How to run

From the repository root:

```bash
docker compose up -d
```

Test endpoint:

```bash
curl http://localhost:8080
```

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Notes

- This setup runs the application in a lightweight container.
- By default, files created in the browser are not persisted to the host filesystem unless using specific cloud storage integrations (e.g., Google Drive, GitHub, or local file system via your browser).
