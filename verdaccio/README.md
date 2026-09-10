# Verdaccio

Verdaccio is a lightweight private npm registry for package caching and internal package publishing.

## How it works

```mermaid
flowchart LR
    NPM([npm/yarn/pnpm]) -->|:4873| Verdaccio[Verdaccio]
    Verdaccio -->|proxy| NPMJS[npmjs.org]
    Verdaccio --> Storage[(./data/storage)]
```

1. Verdaccio serves npm-compatible registry APIs.
2. Teams can publish private packages and proxy npmjs.org.
3. npm/yarn/pnpm clients point to Verdaccio registry URL.
4. Package storage/config persist in mounted volumes.

## Stack details in this repo

- Image: `verdaccio/verdaccio:latest`
- Container name: `verdaccio`
- Endpoint: `http://<host-ip>:4873`
- Persistent data:
  - `./data/storage:/verdaccio/storage`
  - `./data/conf:/verdaccio/conf`

## Environment variables

Copy `.env.example` to `.env`:

- `VERDACCIO_PORT` (default: `4873`)

## How to run

```bash
cd verdaccio
cp .env.example .env
docker compose up -d
```

Podman:

```bash
cd verdaccio
cp .env.example .env
podman compose up -d
```

## Notes

- Default config is provided at `data/conf/config.yaml`.
- Use scoped registries in npm config for best control.

## References

- Official site: <https://verdaccio.org>
- Documentation: <https://verdaccio.org/docs/installation>
- Docker guide: <https://verdaccio.org/docs/docker>
- Docker Hub image: <https://hub.docker.com/r/verdaccio/verdaccio>
- GitHub repo: <https://github.com/verdaccio/verdaccio>
- YouTube — Creating a Local Private NPM registry using Verdaccio: <https://www.youtube.com/watch?v=dYE9vc8KtE4>
