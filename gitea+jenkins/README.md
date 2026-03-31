# Gitea + Jenkins (Docker Compose)

This stack combines source control (Gitea) and CI automation (Jenkins) in one compose setup.  
It is useful for local/self-hosted Git + pipeline workflows.

## How it works

1. Gitea hosts repositories and git access (HTTP + SSH).
2. Jenkins runs CI jobs and can build using host Docker socket.
3. Webhooks from Gitea can trigger Jenkins pipelines.
4. Both services persist data in local mounted directories.

## Stack details in this repo

- Gitea image: `gitea/gitea:latest`
- Jenkins image: `jenkins/jenkins:lts`
- Ports:
  - Gitea UI: `3000`
  - Gitea SSH: `2222`
  - Jenkins UI: `8080`
  - Jenkins agents: `50000`
- Persistent data:
  - `./data/gitea:/data`
  - `./data/jenkins:/var/jenkins_home`
- Docker access for Jenkins:
  - `/var/run/docker.sock:/var/run/docker.sock`

## Environment variables

Copy `.env.example` to `.env`:

- `USER_UID`
- `USER_GID`

## How to run

From the repository root:

```bash
cd gitea+jenkins
cp .env.example .env
docker compose up -d
```

Open:

- Gitea: `http://localhost:3000`
- Jenkins: `http://localhost:8080`

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Notes

- For CI integration, configure a webhook from Gitea repo settings to Jenkins.
- Secure Jenkins and Gitea admin accounts before external exposure.
