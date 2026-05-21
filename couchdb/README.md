# CouchDB

Apache CouchDB is a document-oriented NoSQL database with a RESTful HTTP API.  
It stores JSON documents, supports MapReduce views, and provides built-in replication for distributed setups.

## How CouchDB works

```mermaid
flowchart LR
    App([Application]) -->|:5984| CouchDB[CouchDB API]
    CouchDB --> Data[(Document Store)]
    Admin([Admin]) -->|:5984/_utils| Fauxton[Fauxton UI]
```

1. CouchDB exposes a RESTful HTTP API on port 5984.
2. Applications create, read, update, and delete JSON documents via HTTP.
3. Fauxton (built-in admin UI) is available at `/_utils` for database management.
4. Data persists in a Docker volume across container restarts.

## Stack details in this repo

- Image: `couchdb:latest`
- Container name: `couchdb`
- HTTP API / Fauxton UI: `http://<host-ip>:5984`
- Persistent data:
  - `couchdb-data:/opt/couchdb/data`

## Environment variables

Configured directly in `docker-compose.yml`:

- `COUCHDB_USER` (default: `admin`)
- `COUCHDB_PASSWORD` (default: `password`)

## How to run

From the repository root:

```bash
cd couchdb
docker compose up -d
```

Open:

- Fauxton UI: `http://localhost:5984/_utils`
- API root: `http://localhost:5984`

Login with the credentials from `docker-compose.yml`.

Test the API:

```bash
# Check server info
curl http://admin:password@localhost:5984/

# Create a database
curl -X PUT http://admin:password@localhost:5984/mydb

# Insert a document
curl -X POST http://admin:password@localhost:5984/mydb \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "value": 42}'

# List all databases
curl http://admin:password@localhost:5984/_all_dbs
```

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Use it effectively

- Use Fauxton for quick database/document browsing and query testing.
- Leverage CouchDB replication for syncing data between nodes or to PouchDB clients.
- Create MapReduce views for indexed queries on large document sets.
- Use Mango queries (`_find` endpoint) for ad-hoc JSON queries.

## Notes

- Change default credentials before exposing CouchDB externally.
- CouchDB is schema-free — each document can have a different structure.
- For production clusters, configure multiple nodes with the cluster setup wizard in Fauxton.
- See [CouchDB docs](https://docs.couchdb.org/) for full configuration reference.
