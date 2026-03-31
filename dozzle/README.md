# Dozzle

Dozzle is a lightweight web UI for live container logs.

## Stack details

- Image: `amir20/dozzle:latest`
- UI: `http://<host-ip>:8088`
- Socket mapping via `DOZZLE_SOCKET`

## How to run

```bash
cd dozzle
cp .env.example .env
podman compose up -d
```

Socket path options in `.env`:

```env
DOZZLE_SOCKET=/run/podman/podman.sock
```

Docker override:

```env
DOZZLE_SOCKET=/var/run/docker.sock
```

Then run with your engine:

```bash
podman compose up -d
# or
docker compose up -d
```
