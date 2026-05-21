# DocumentDB

DocumentDB Local is a local emulator for Amazon DocumentDB (MongoDB-compatible).  
It allows you to develop and test document database workloads locally without connecting to AWS.

## How DocumentDB works

```mermaid
flowchart LR
    App([Application]) -->|:10260| DocDB[DocumentDB Local]
    DocDB --> Data[(Document Store)]
    CLI([mongosh]) -->|:10260| DocDB
```

1. DocumentDB Local starts and listens on port 10260 with MongoDB wire protocol compatibility.
2. Applications connect using standard MongoDB drivers and connection strings.
3. You can use `mongosh` or any MongoDB client to interact with the database.
4. Data is stored in-container (ephemeral by default).

## Stack details in this repo

- Image: `ghcr.io/documentdb/documentdb/documentdb-local:latest`
- Container name: `documentdb`
- Port: `10260`
- Protocol: MongoDB wire protocol compatible

## Environment variables

Set via `.env` (copy from `.env.example`):

- `DOCUMENTDB_PORT` (default: `10260`)
- `DOCUMENTDB_USERNAME` (default: `admin`)
- `DOCUMENTDB_PASSWORD` (default: `changeme`)

## How to run

From the repository root:

```bash
cd documentdb
cp .env.example .env
docker compose up -d
```

Connect with mongosh:

```bash
mongosh "mongodb://admin:changeme@localhost:10260/?directConnection=true"
```

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Use it effectively

- Use standard MongoDB drivers (Node.js, Python, Java, etc.) pointed at `localhost:10260`.
- Test DocumentDB-specific query behavior and compatibility locally before deploying to AWS.
- Use `mongosh` for interactive queries and administration.
- Pair with your application's integration tests for fast local feedback.

## Notes

- Change default credentials before exposing externally.
- This is a local emulator — not all DocumentDB features may be available.
- Data does not persist across container restarts by default. Add a volume mount if persistence is needed.
- See [DocumentDB Local docs](https://github.com/documentdb/documentdb) for compatibility details.
