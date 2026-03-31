# Woodpecker CI

Woodpecker CI is a lightweight, self-hosted continuous integration system.  
This setup runs a Woodpecker server plus one Docker-based build agent.

## How it works

1. `woodpecker-server` provides the web UI/API and receives webhook events.
2. GitHub OAuth is used for login and repository access.
3. `woodpecker-agent` polls the server for pipeline jobs.
4. The agent executes jobs using the host Docker daemon via `docker.sock`.

## Stack details in this repo

- Server image: `woodpeckerci/woodpecker-server:next-6e6e9c4166`
- Agent image: `woodpeckerci/woodpecker-agent:next-6e6e9c4166`
- Ports:
  - `8000` (web UI/API)
  - `9000` (gRPC server-agent communication)
- Persistent data:
  - `woodpecker-server-data:/var/lib/woodpecker`
- Docker access for agent:
  - `/var/run/docker.sock:/var/run/docker.sock`

## Environment variables

Set via `.env` (copy from `.env.example`):

- `WOODPECKER_GITHUB_CLIENT`
- `WOODPECKER_GITHUB_SECRET`
- `WOODPECKER_AGENT_SECRET`
- `WOODPECKER_HOST`

Compose also sets:

- `WOODPECKER_OPEN=true`
- `WOODPECKER_GITHUB=true`
- `WOODPECKER_GRPC_ADDR=:9000`

## How to run

From the repository root:

```bash
cd woodpecker-ci
cp .env.example .env
# Fill .env with real GitHub OAuth + host values
docker compose up -d
```

Open:

- `http://localhost:8000`

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Use it effectively

- Configure a GitHub OAuth app callback URL to your `WOODPECKER_HOST`.
- Keep `WOODPECKER_AGENT_SECRET` identical on server and agent.
- Register repositories in Woodpecker UI to enable pipelines.

## Notes

- The agent has access to host Docker, so treat it as privileged.
- Do not commit real OAuth credentials to git.
