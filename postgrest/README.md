PostgREST
========

**Overview**
- **Description**: PostgREST exposes a PostgreSQL schema as a RESTful API using the `postgrest` image.
- **Purpose**: Example compose stack with a Postgres DB, PostgREST API and Swagger UI.

**Files**
- **Compose**: [postgrest/docker-compose.yml](postgrest/docker-compose.yml#L1-L40)
- **Init SQL**: [postgrest/init.sql](postgrest/init.sql#L1-L200)

**Ports**
- **Postgres**: `5432` (host -> container)
- **PostgREST API**: `3000` (host -> container)
- **Swagger UI**: `8080` (host -> container)

**Quick start**
PostgREST
========

PostgREST example stack (Postgres + PostgREST + Swagger UI).

Overview
- Exposes PostgreSQL schema `api` as a REST API using PostgREST.

Stack details
- Image: `postgres:16-alpine`, container: `postgres_db`
- Image: `postgrest/postgrest:v12.2.3`, container: `postgrest_api`
- Image: `swaggerapi/swagger-ui:latest`, container: `swagger_ui`

Ports
- Postgres: `5432`
- PostgREST: `3000`
- Swagger UI: `8080`

Environment variables (see `docker-compose.yml`)
- `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` — DB credentials
- `PGRST_DB_URI`, `PGRST_DB_SCHEMA`, `PGRST_DB_ANON_ROLE` — PostgREST config

How to run
```bash
cd postgrest
docker compose up -d
```

Open
- Swagger UI: http://localhost:8080
- PostgREST API: http://localhost:3000

Test with curl (CRUD)
Base URL: http://localhost:3000

- Create (POST)
```bash
curl -s -X POST "http://localhost:3000/todos" \
	-H "Content-Type: application/json" \
	-H "Prefer: return=representation" \
	-d '{"task":"Buy milk","done":false}' | jq
```

- Read all (GET)
```bash
curl -s "http://localhost:3000/todos" | jq
```

- Read single (GET)
```bash
curl -s "http://localhost:3000/todos?id=eq.1" | jq
```

- Update (PATCH)
```bash
curl -s -X PATCH "http://localhost:3000/todos?id=eq.1" \
	-H "Content-Type: application/json" \
	-H "Prefer: return=representation" \
	-d '{"done":true}' | jq
```

- Delete (DELETE)
```bash
curl -s -X DELETE "http://localhost:3000/todos?id=eq.1"
```

Useful commands
- `docker compose ps`
- `docker compose logs -f postgrest_api`
- `docker compose restart postgrest_api`
- `docker compose down`

Notes
- `init.sql` seeds `api.todos` and grants `anon` read/write access.
- Change DB passwords before exposing services externally.

References
- https://postgrest.org
**References**
- PostgREST docs: https://postgrest.org

