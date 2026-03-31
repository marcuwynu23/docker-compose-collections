# Portainer

Portainer is a lightweight web UI for managing Docker environments.  
It provides a dashboard to view containers, images, volumes, networks, stacks, and logs without relying only on CLI commands.

## How Portainer works

1. The Portainer container starts and connects to your local Docker Engine through `docker.sock`.
2. It reads container/runtime state from Docker and shows it in the web UI.
3. Actions from the UI (start/stop/redeploy/remove) are sent back to Docker via that socket.
4. Portainer stores its own settings and user data in a persistent Docker volume.

## Stack details in this repo

- Image: `portainer/portainer-ce:lts`
- Container name: `portainer`
- Web UI (HTTPS): `https://<host-ip>:9443`
- Edge Agent tunnel port: `8000` (optional)
- Persistent data:
  - `portainer_data:/data`
- Docker access:
  - `/var/run/docker.sock:/var/run/docker.sock`

## Environment variables

This compose setup does not require environment variables by default.

## How to run

From the repository root:

```bash
cd portainer
docker compose up -d
```

Open:

- `https://localhost:9443`

On first access, create the admin account, then select the local Docker environment.

Useful commands:

```bash
docker compose ps          # check container status
docker compose logs -f     # stream logs
docker compose restart     # restart service
docker compose down        # stop and remove container
```

## Use Portainer effectively

- Use **Stacks** to deploy and manage compose apps.
- Use **Containers** for quick lifecycle actions (start/stop/restart/logs).
- Use **Volumes** and **Networks** pages to inspect Docker resources.

## Notes

- Portainer needs access to `/var/run/docker.sock`; this gives broad control over Docker on the host.
- Port `8000` is only needed for Edge Agents and can be removed if unused.
- Browser may show a certificate warning on first load because Portainer serves HTTPS by default.
