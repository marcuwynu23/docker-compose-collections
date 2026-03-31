# code-server (Docker Compose)

code-server runs VS Code in the browser for remote development.

## How it works

1. The container starts a web-based VS Code server.
2. You authenticate using the configured password.
3. Projects are stored in the mounted `config` volume.
4. Extensions/settings persist across restarts.

## Stack details in this repo

- Image: `lscr.io/linuxserver/code-server:latest`
- Container name: `code-server`
- Web UI: `https://<host-ip>:8449` (default)
- Persistent data:
  - `./config:/config`

## Environment variables

Copy `.env.example` to `.env`:

- `TZ`, `PUID`, `PGID`
- `CODE_SERVER_PORT`
- `CODE_SERVER_PASSWORD`
- `CODE_SERVER_SUDO_PASSWORD`

## How to run

```bash
cd code-server
cp .env.example .env
docker compose up -d
```

Podman:

```bash
cd code-server
cp .env.example .env
podman compose up -d
```

## Notes

- Access over HTTPS with a self-signed cert by default.
- Change default passwords before exposing publicly.
