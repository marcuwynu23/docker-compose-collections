# BIND 9

BIND 9 is a full-featured authoritative and recursive DNS server for small networks and labs.  
Point your VMs and machines to BIND 9 as DNS, and it resolves your custom local records while forwarding everything else to upstream resolvers.

## How BIND 9 works

```mermaid
flowchart LR
    Device([VM / Machine]) -->|:53| Bind9[BIND 9 DNS]
    Bind9 -->|local match| Local[Local Records]
    Bind9 -->|other domains| Upstream[Upstream DNS]
    Admin([Admin]) -->|edit files| Conf[named.conf + zone file]
```

1. A VM or machine asks for a domain (for example, `vm01.marcuwynu23.local`).
2. BIND 9 checks the authoritative `marcuwynu23.local` master zone in `config/zones/db.marcuwynu23.local` for matching `A` records.
3. If matched, BIND 9 returns the configured local IP directly.
4. If not matched, BIND 9 uses recursion plus the `forwarders` (`10.126.90.124`, `1.1.1.1`, `8.8.8.8` in this repo) to resolve external domains.
5. BIND 9 caches responses to speed up future lookups.

## Stack details in this repo

- Image: `ubuntu/bind9:latest`
- Container name: `bind9`
- DNS ports exposed: `53/tcp`, `53/udp`
- Config files (read-only mounts):
  - `./config/named.conf:/etc/bind/named.conf:ro`
  - `./config/zones:/etc/bind/zones:ro`
- Local domain in this repo: `marcuwynu23.local`
- Local records in this repo:
  - `dns.marcuwynu23.local` → `10.126.90.210`
  - `gateway.marcuwynu23.local` → `10.126.90.124`
  - `vm01.marcuwynu23.local` → `10.126.90.101`
  - `vm02.marcuwynu23.local` → `10.126.90.102`
  - `vm03.marcuwynu23.local` → `10.126.90.103`
- Upstream servers in this repo:
  - `10.126.90.124`
  - `1.1.1.1`
  - `8.8.8.8`
- Allowed clients in this repo:
  - `10.126.90.0/24` and `localhost` (`allow-query` in `named.conf`)

## Environment variables

This compose setup does not use a `.env` file by default. All configuration is done in `config/named.conf` and `config/zones/db.marcuwynu23.local`:

- `zone "marcuwynu23.local"` — local authoritative master zone (current: `marcuwynu23.local`)
- `<name> IN A <ip>` in `db.marcuwynu23.local` — add one line per local A record
- `SOA` serial (`2026091301` in this repo) — increment on every zone-file edit so the change is picked up
- `NS dns.marcuwynu23.local.` — authoritative nameserver for the zone
- `forwarders { ...; };` — upstream resolvers used for non-local queries
- `allow-query { ...; };` — which client networks may query (current: `10.126.90.0/24`, `localhost`)
- `recursion yes;` — allow recursive resolution of external domains
- `listen-on { any; };` / `listen-on-v6 { any; };` — listen address inside the container

> After editing `named.conf` or the zone file, increment the SOA serial and restart the container to apply changes.

## How to run

From the repository root:

```bash
cd bind9
docker compose up -d
```

Verify:

```bash
docker compose ps          # check container status
docker compose logs -f     # stream logs
nslookup vm01.marcuwynu23.local 127.0.0.1
dig @127.0.0.1 vm01.marcuwynu23.local
```

Useful commands:

```bash
docker compose restart     # restart service (required after editing named.conf or zone file)
docker compose down        # stop and remove container
```

## Use BIND 9 for your network

BIND 9 only works if each VM/machine on the same network uses the BIND 9 host IP as its DNS server. Replace `<dns-host-ip>` below with the IP of the machine running this stack (example in this repo: `10.126.90.210`).

### Option A: Configure directly in router (recommended)

Set BIND 9 as the default DNS your router hands out via DHCP, so every VM/machine gets it automatically with no per-device setup:

```mermaid
flowchart LR
    Admin([Admin]) -->|set Primary DNS = BIND 9 IP| Router[Router / Gateway DHCP]
    Router -->|DHCP: IP + DNS| VM1[VM01]
    Router -->|DHCP: IP + DNS| VM2[VM02]
    Router -->|DHCP: IP + DNS| VM3[VM03]
    VM1 -->|:53| Bind9[BIND 9 DNS]
    VM2 -->|:53| Bind9
    VM3 -->|:53| Bind9
    Bind9 -->|local match| Local[Local Records]
    Bind9 -->|other domains| Upstream[Upstream DNS]
```

1. Log in to your router/gateway admin panel (commonly `http://192.168.1.1`, `http://10.126.90.124`, or as in this repo `http://gateway.marcuwynu23.local`).
2. Find DHCP / LAN / DNS settings. Common labels:
   - `DHCP Server > Primary DNS / Secondary DNS`
   - `LAN > DHCP > DNS Server`
   - `Internet > DNS / Static DNS`
   - `Network > DHCP & DNS`
3. Set:
   - Primary DNS: `<dns-host-ip>` (example: `10.126.90.210`)
   - Secondary DNS: `<dns-host-ip>` or upstream fallback (example: `1.1.1.1`)
4. Save / Apply, then renew DHCP on clients so they pick up the new DNS:
   ```bash
   # Linux
   sudo dhclient -r && sudo dhclient
   # Windows (Admin CMD)
   ipconfig /release && ipconfig /renew && ipconfig /flushdns
   ```
5. Verify on any client that it received the DNS:
   ```bash
   # Linux
   resolvectl status
   cat /etc/resolv.conf
   # Windows
   ipconfig /all
   nslookup vm01.marcuwynu23.local
   ```

> Once the router advertises `<dns-host-ip>`, all new DHCP leases resolve `*.marcuwynu23.local` automatically. Existing devices only need a DHCP renew/reconnect — no manual DNS entry.

### Option B: Set DNS per VM/machine (same network)

Use this if you cannot change the router, or for static-IP VMs/machines.

- Per Linux VM with `systemd-resolved`:

  ```bash
  sudo resolvectl dns eth0 <dns-host-ip>
  sudo resolvectl domain eth0 marcuwynu23.local
  resolvectl status
  ```

- Per Linux VM with classic `/etc/resolv.conf`:

  ```bash
  sudo nano /etc/resolv.conf
  ```

  Put BIND 9 first:

  ```text
  nameserver <dns-host-ip>
  nameserver 1.1.1.1
  search marcuwynu23.local
  ```

- Per Linux VM with Netplan (`/etc/netplan/*.yaml`):

  ```yaml
  network:
    version: 2
    ethernets:
      eth0:
        nameservers:
          addresses: [<dns-host-ip>, 1.1.1.1]
          search: [marcuwynu23.local]
  ```

  Then apply:

  ```bash
  sudo netplan apply
  ```

- Per Linux VM with NetworkManager:

  ```bash
  sudo nmcli con mod "Wired connection 1" ipv4.dns "<dns-host-ip> 1.1.1.1"
  sudo nmcli con mod "Wired connection 1" ipv4.dns-search "marcuwynu23.local"
  sudo nmcli con mod "Wired connection 1" ipv4.ignore-auto-dns yes
  sudo nmcli con up "Wired connection 1"
  ```

- Per Windows VM/machine (PowerShell as Administrator):

  ```powershell
  Set-DnsClientServerAddress -InterfaceAlias "Ethernet" -ServerAddresses "<dns-host-ip>", "1.1.1.1"
  ipconfig /flushdns
  nslookup vm01.marcuwynu23.local
  ```

  GUI alternative: `Control Panel > Network and Sharing Center > Adapter settings > IPv4 Properties > Use the following DNS server addresses`.

- Per macOS machine:

  ```bash
  sudo networksetup -setdnsservers Wi-Fi <dns-host-ip> 1.1.1.1
  sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
  nslookup vm01.marcuwynu23.local
  ```

Test from each VM/machine:

```bash
nslookup vm01.marcuwynu23.local <dns-host-ip>
dig @<dns-host-ip> vm01.marcuwynu23.local
ping vm01.marcuwynu23.local
```

If `nslookup` without specifying the server still fails, that machine is not using BIND 9 yet — re-check its DNS settings.

## Notes

- Every VM/machine on the same network must use the BIND 9 host IP as DNS — just running the container is not enough. Easiest is Option A above: configure it once in your router DHCP so it becomes the default DNS connection for all clients.
- Give the BIND 9 host a static IP (example: `10.126.90.210`). If its IP changes, you must update DNS settings on all VMs/machines or in your router DHCP config.
- All machines must be on the same network / reachable L2/L3 path to the BIND 9 host. Cross-VLAN or firewalled clients need UDP/TCP `53` allowed toward the BIND 9 host.
- Only one DNS service should bind host port `53`. Stop systemd-resolved stub, Pi-hole, FreeIPA DNS, dnsmasq, CoreDNS, Unbound, or other services using port `53` on the Docker host, or remap ports.
- Clients outside `10.126.90.0/24` (except localhost) are refused by `allow-query`. If your network uses a different subnet, update the `allow-query` block in `config/named.conf` and restart.
- Unlike dnsmasq, this BIND 9 setup does not provide DHCP. Keep your router as DHCP server.
- To add a host, add one line to `config/zones/db.marcuwynu23.local`, bump the SOA serial, and restart:
  ```text
  newhost IN      A       10.126.90.104
  ```
  ```bash
  docker compose restart
  ```

## References

- Official site: <https://www.isc.org/bind/>
- Documentation: <https://bind9.readthedocs.io/>
- Docker Hub image: <https://hub.docker.com/r/ubuntu/bind9>
- GitHub source: <https://github.com/ubuntu-docker/bind9>
