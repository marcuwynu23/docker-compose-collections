# OpenRepo

OpenRepo is a web-based server for managing and hosting repositories containing Debian apt/deb, Redhat rpm, and generic package files.

## How OpenRepo works

```mermaid
flowchart LR
    Client([Client]) -->|:8080| Nginx[nginx]
    Nginx --> Django[django]
    Django --> DB[(postgres)]
```

1. Nginx serves as a reverse proxy on port 7376, forwarding requests to the Django application
2. Django provides the web interface for managing repository metadata and packages
3. PostgreSQL stores repository metadata, package information, and user data
4. The server supports hosting Debian, Redhat, and generic package repositories through a unified web interface

## Stack details in this repo

- Image: `ghcr.io/openkilt/openrepo:latest`
- Container names: `nginx`, `django`, `worker`, `db`
- HTTP port: `7376` (nginx) maps to `8080` (container)
- Django port: `8000` (internal)
- HTTPS port: not exposed (TLS handled externally)
- Persistent data:
  - `openrepo-data:/var/lib/openrepo` (application data)
  - `openrepo-data/postgres:/var/lib/postgresql/data` (database)

## Environment variables

Set via `.env` (copy from `.env.example`):

- `DJANGO_SECRET_KEY` (required - generate with: `openssl rand -hex 32`)
- `OPENREPO_PG_PASSWORD` (required - generate with: `openssl rand -hex 24`)
- `OPENREPO_DB_TYPE` (default: `postgresql`)
- `OPENREPO_PG_DATABASE` (default: `openrepo`)
- `OPENREPO_PG_USERNAME` (default: `postgres`)
- `OPENREPO_PG_HOSTNAME` (default: `db`)

## How to run

From the repository root:

```bash
cd openrepo
cp .env.example .env
docker compose up -d
```

Test:

```bash
curl http://localhost:7376
```

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Use it effectively

- Access the web interface at `http://localhost:7376`
- Default admin credentials are set up during initial installation
- Use the worker service for background repository operations
- Regularly backup the `openrepo-data` volume for data persistence
- Monitor database health via `docker compose logs db`

## Notes

- The application requires a valid `DJANGO_SECRET_KEY` and `OPENREPO_PG_PASSWORD` to start
- PostgreSQL must be reachable at the `db` hostname when using docker compose networking
- Workers process background tasks; ensure the worker service is running for full functionality
- See the [OpenRepo documentation](https://openkilt.github.io/openrepo/) for more details

## References

- Official site: <https://openkilt.github.io/openrepo/>
- Documentation: <https://openkilt.github.io/openrepo/docs/>
- GitHub repository: <https://github.com/openkilt/openrepo>
- Docker Hub image: <https://hub.docker.com/layers/openkilt/openrepo/latest/sha256-?>