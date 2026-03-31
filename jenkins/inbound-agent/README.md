# Jenkins Inbound Agent (Docker Compose)

This stack runs a Jenkins inbound agent container that connects to an existing Jenkins controller.  
It is useful for adding a dedicated worker node with Docker build capability.

## How it works

1. Agent container starts from the local Dockerfile build.
2. It connects to `JENKINS_URL` using agent name/secret.
3. Jobs assigned by Jenkins run inside this agent.
4. Mounted `docker.sock` lets agent run Docker-based build steps.

## Stack details in this repo

- Service: `jenkins-agent` (built from local `Dockerfile`)
- Container name: `jenkins-agent`
- Persistent data:
  - `agent_workdir:/home/jenkins/agent`
- Host mounts:
  - `/var/run/docker.sock:/var/run/docker.sock`
  - `/usr/bin/docker:/usr/bin/docker` (optional helper)

## Environment variables

Configured in compose:

- `JENKINS_URL`
- `JENKINS_AGENT_NAME`
- `JENKINS_SECRET`
- `JENKINS_WEB_SOCKET`
- `JENKINS_AGENT_WORKDIR`

## How to run

From the repository root:

```bash
cd jenkins/inbound-agent
docker compose up -d --build
```

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Notes

- Replace `JENKINS_SECRET` with the real node secret from Jenkins.
- Keep agent image and toolchain aligned with your pipeline requirements.
