# Pi-hole (Docker Compose)

Pi-hole is a network-level ad and tracker blocker.  
Instead of installing ad blockers on every device, you point your devices/router to Pi-hole as DNS, and it blocks known ad/tracking domains for the whole network.

## How Pi-hole works

1. A device asks for a domain (for example, `ads.example.com`).
2. Pi-hole checks its blocklists.
3. If the domain is blocked, Pi-hole returns a non-routable/empty response.
4. If allowed, Pi-hole forwards the request to upstream DNS resolvers (configured here as Cloudflare and Google by default).
5. Pi-hole caches DNS results to speed up future lookups.

## Stack details in this repo

- Image: `pihole/pihole:latest`
- Container name: `pihole`
- Web UI: `http://<host-ip>:8080/admin`
- Optional HTTPS: `https://<host-ip>:8443/admin`
- DNS ports exposed: `53/tcp`, `53/udp`
- Persistent data:
  - `./data/etc-pihole:/etc/pihole`
  - `./data/etc-dnsmasq.d:/etc/dnsmasq.d`

## Environment variables

You can set these values directly in your shell or by creating a `.env` file from `.env.example`.

- `TZ` (default in compose: `Asia/Manila`)
- `WEBPASSWORD` (default in compose: `Password123`)
- `DNS1` (default: `1.1.1.1`)
- `DNS2` (default: `8.8.8.8`)

> Change `WEBPASSWORD` before exposing Pi-hole to other devices.

## How to run

From the repository root:

```bash
cd pihole
cp .env.example .env
docker compose up -d
```

Open:

- `http://localhost:8080/admin`

Log in using the password from `WEBPASSWORD` in your `.env`.

Useful commands:

```bash
docker compose ps          # check container status
docker compose logs -f     # stream logs
docker compose restart     # restart service
docker compose down        # stop and remove container
```

## Use Pi-hole for your network

- Per device: set DNS server to your Pi-hole host IP.
- Whole network: set your router DHCP DNS to the Pi-hole host IP.

After that, devices using that DNS path will be filtered by Pi-hole.

## Notes

- Only one DNS service should bind host port `53`. Stop/avoid other local DNS servers that use port `53`.
- For best results, keep your blocklists updated in the Pi-hole admin panel.
