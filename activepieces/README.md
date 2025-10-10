# 🧩 Activepieces Self-Hosting Guide (Docker + WSL)

## 📘 Overview

This guide explains how to install and run **Activepieces** — a fully open-source workflow automation platform — on **Docker Compose**, with **Redis** and **PostgreSQL** as dependencies.

It also covers how to run it on **Windows Subsystem for Linux (WSL)** and basic troubleshooting steps.

---

## 📁 1. Create Project Structure

```bash
mkdir -p data postgres_data redis_data
```

This will store persistent data for:

- `data` → Activepieces app data
- `postgres_data` → PostgreSQL database files
- `redis_data` → Redis cache

---

## 🧱 2. Create `docker-compose.yml`

Create a new file named **`docker-compose.yml`** and paste the following:

```yaml
services:
  redis:
    image: redis:7
    container_name: activepieces-redis
    restart: unless-stopped
    volumes:
      - ./redis_data:/data

  db:
    image: postgres:16
    container_name: activepieces-db
    restart: unless-stopped
    environment:
      POSTGRES_USER: activepieces
      POSTGRES_PASSWORD: activepieces
      POSTGRES_DB: activepieces
    # ✅ use named volume (avoids permission issues on host bind mounts)
    volumes:
      - postgres_data:/var/lib/postgresql/data

  activepieces:
    image: activepieces/activepieces:latest
    container_name: activepieces
    depends_on:
      - redis
      - db
    ports:
      - "8080:80"
    environment:
      # Redis config
      AP_REDIS_HOST: redis
      AP_REDIS_PORT: 6379

      # PostgreSQL config
      AP_DATABASE_TYPE: postgres
      AP_POSTGRES_HOST: db
      AP_POSTGRES_PORT: 5432
      AP_POSTGRES_USERNAME: activepieces
      AP_POSTGRES_PASSWORD: activepieces
      AP_POSTGRES_DATABASE: activepieces

      # General app config
      AP_FRONTEND_URL: http://localhost:8080
      AP_ENCRYPTION_KEY: 703ee45e7a485db357aa8517a2793ddf
      AP_JWT_SECRET: supersecretjwtkey
      AP_TELEMETRY_ENABLED: false
      AP_SYNC_PIECES_ON_STARTUP: false

    volumes:
      - ./data:/root/.activepieces
    restart: unless-stopped

volumes:
  postgres_data:
  redis_data:
```

> 💡 **Tip:**  
> Replace the value of `AP_ENCRYPTION_KEY` with your own key generated via:
>
> ```bash
> openssl rand -hex 16
> ```

---

## 🚀 3. Start Activepieces

```bash
docker compose up -d
```

Check running containers:

```bash
docker compose ps
```

✅ You should see:

```
NAME                STATE     PORTS
activepieces-db     Up        5432/tcp
activepieces-redis  Up        6379/tcp
activepieces        Up        0.0.0.0:8080->80/tcp
```

Then open your browser:

👉 **http://localhost:8080**

---

## 🧹 4. Stop Activepieces

To stop the stack without removing data:

```bash
docker compose down
```

To remove containers **and** data (fresh reinstall):

```bash
docker compose down -v
```

---

## 🪟 5. Running Under WSL

If you’re on Windows and using WSL (e.g., Ubuntu), you can run Docker commands from WSL directly:

### Start Activepieces:

```bash
wsl -e docker compose up -d
```

### Stop Activepieces:

```bash
wsl -e docker compose down
```

---

## ⚙️ 6. Troubleshooting

### 🔹 `AP_ENCRYPTION_KEY is missing or invalid`

Generate a valid key:

```bash
openssl rand -hex 16
```

Then update `AP_ENCRYPTION_KEY` in your `.yml`.

### 🔹 `SYSTEM_PROP_NOT_DEFINED: AP_REDIS_HOST`

Ensure Redis is defined and included under `depends_on` in your Docker Compose file.

### 🔹 `ConnectTimeoutError` or `Error syncing piece`

Occurs when the container cannot access the internet to sync default integrations.  
Fix options:

- Ensure Docker has internet access
- Or disable the sync step:
  ```yaml
  AP_SYNC_PIECES_ON_STARTUP: false
  ```

### 🔹 `502 Bad Gateway`

Usually occurs if the backend is still initializing or Redis/Postgres isn’t ready.  
Wait 15–30 seconds after startup, then refresh the page.

### 🔹 Postgres Permission Error

If you see:

```
initdb: could not change permissions of directory "/var/lib/postgresql/data"
```

use **named volumes** instead of host-mounted folders, or fix host directory permissions:

```bash
sudo chown -R 999:999 postgres_data
```

---

## 🧩 7. Useful Commands

| Command                                   | Description                 |
| ----------------------------------------- | --------------------------- |
| `docker compose logs -f activepieces`     | View live logs              |
| `docker exec -it activepieces bash`       | Open shell inside container |
| `docker compose restart`                  | Restart services            |
| `docker compose ps`                       | Check container status      |
| `curl http://localhost:8080/api/v1/flags` | Verify backend API response |

---

## 🧰 8. Optional Network Configuration

If Docker containers can’t access the internet, create or verify your DNS config at `/etc/docker/daemon.json`:

```json
{
  "dns": ["8.8.8.8", "1.1.1.1"]
}
```

Then restart Docker:

```bash
sudo systemctl restart docker
```

---

## ✅ 9. Summary

| Component      | Purpose                       | Persistent Data   |
| -------------- | ----------------------------- | ----------------- |
| `activepieces` | Main app (frontend + backend) | `./data`          |
| `postgres`     | Database                      | `./postgres_data` |
| `redis`        | Cache / queues                | `./redis_data`    |

Once all services are running, you can automate workflows locally at:  
👉 **http://localhost:8080**
