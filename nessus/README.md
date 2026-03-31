# Nessus

Nessus is a vulnerability scanner used for infrastructure and host security assessments.  
This setup runs the official Nessus container with persistent scan/config data.

## How it works

1. The Nessus service starts and exposes the web interface.
2. You complete initial setup/license in the Nessus UI.
3. Scan policies and results are stored in the mounted volume.
4. Future restarts reuse the same Nessus state/data.

## Stack details in this repo

- Image: `tenable/nessus:10.7.0-ubuntu`
- Container name: `nessus`
- Web UI: `https://<host-ip>:8834`
- Persistent data:
  - `nessus-data:/opt/nessus`

## Environment variables

No environment variables are required by this compose file.

## How to run

From the repository root:

```bash
cd nessus
docker compose up -d
```

Open:

- `https://localhost:8834`

Useful commands:

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Notes

- Browser certificate warnings are expected on first load.
- Initial plugin updates can take time before Nessus is fully ready.
