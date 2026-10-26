# AGENTS.md

This file provides guidance for AI agents working with this docker-compose collections project. It follows the same format as `docker-compose.yml`, `.env.example`, and `README.md` files in each project directory.

## Project Structure

The repository contains docker-compose configurations for various services. Each project has its own directory with:
- `docker-compose.yml` - Service definitions
- `.env.example` - Environment variable examples
- `README.md` - Documentation

## Adding a New Item

When creating a new item/integration, follow these steps:

1. Create a new directory for the project
2. Add `docker-compose.yml` with service configuration
3. Add `.env.example` with required environment variables
4. Add `README.md` with documentation following the template below

## docker-compose.yml Format

```yaml
name: <service-name>
services:
  <service>:
    image: <image>:<tag>
    container_name: <container-name>
    ports:
      - "${<VAR>_PORT:-<default>}:<port>"
    volumes:
      - ./<file>:/etc/<path>:ro
      - <named-volume>:/data
    restart: unless-stopped

volumes:
  <named-volume>:
```

## .env.example Format

```
VAR1=<default-value>
VAR2=<default-value>
```

## README.md Template

```markdown
# <Service Name>

<Description>

## How <service> works

```mermaid
flowchart LR
    Client([Client]) -->|<ports>| <container>[<container-name>]
    <container> --> <upstream>[<upstream-service>]
```

1. <key point>
2. <key point>

## Stack details in this repo

- Image: `<image>:<tag>`
- Container name: `<container-name>`
- Ports: `<http-port>:<container-port>`
- Persistent data:
  - `<volume>:<path>` (<description>)

## Environment variables

Set via `.env` (copy from `.env.example`):

- `<VAR>` (default: `<default>`)

## How to run

From the repository root:

```bash
cd <project-directory>
cp .env.example .env
docker compose up -d
```

Test:

```bash
curl http://localhost
```

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Use it effectively

- <tip 1>
- <tip 2>

## Notes

- <important-note>

## References

- Official site: <https://...>
- Documentation: <https://...>
- Docker Compose guide: <https://...>
- Docker Hub image: <https://hub.docker.com/...>
```

## Agent Guidelines

- Always copy `.env.example` to `.env` before running `docker compose up`
- Use environment variables from `.env` for configuration
- Persistent data is stored in named volumes defined in `docker-compose.yml`
- Each project follows the same structure for consistency
- Before running any service, ensure `.env` file exists and has required variables
- Check docker-compose.yml for port mappings and volume configurations
- Use `docker compose ps` to verify all services are running
- For troubleshooting, use `docker compose logs <service>` to check service logs