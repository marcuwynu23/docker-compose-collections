# Bugzilla (Docker Compose)

:contentReference[oaicite:0]{index=0} is an open-source issue tracking system used for tracking software bugs, feature requests, and project tasks.

This setup runs Bugzilla using Docker with a MySQL backend.

---

## Stack details in this repo

- Bug tracker: `nasqueron/bugzilla:latest`
- Database: `mysql:5.7`
- Web UI: `http://localhost:8080`
- Ports exposed:
  - `8080 → 80` (Bugzilla web server)
- Persistent data:
  - `./data:/var/lib/mysql` (MySQL storage)

---

## How Bugzilla works

1. User opens the Bugzilla web interface in the browser.
2. Bugzilla connects to a MySQL database container.
3. All bugs, users, and projects are stored in the database.
4. Web server serves the UI via Apache inside the container.

---

## Environment variables

### Bugzilla service

- `DB_TYPE=mysql`  
  Database driver used by Bugzilla

- `DB_HOST=db`  
  Database container name

- `DB_DATABASE=bugzilla`  
  MySQL database name

- `DB_USER=bugzilla`  
  Database username

- `DB_PASSWORD=bugzilla`  
  Database password

- `BUGZILLA_URL=http://localhost:8080`  
  Base URL used by Bugzilla (important for correct links and emails)

---

### MySQL service

- `MYSQL_ROOT_PASSWORD=rootpassword`  
  Root database password

- `MYSQL_DATABASE=bugzilla`  
  Auto-created database

- `MYSQL_USER=bugzilla`  
  Application database user

- `MYSQL_PASSWORD=bugzilla`  
  Password for application user

---

## How to run

From the directory containing `docker-compose.yml`:

```bash
docker compose up -d
```

Check running containers:

    docker compose ps

View logs:

    docker compose logs -f bugzilla

Stop services:

    docker compose down

---

## Access Bugzilla

Open in your browser:

    http://localhost:8080

---

## Default login

After installation, Bugzilla typically requires you to create an admin account during setup.

If your image provides default credentials, check logs:

    docker logs <bugzilla_container>

---

## Reset / clean reinstall

⚠️ This will delete all bugs and database data:

    docker compose down -vrm -rf ./data

---

## Notes

- Ensure port `8080` is not used by other services.
- MySQL 5.7 is used for compatibility with Bugzilla images.
- First startup may take time due to database initialization.
- Always keep `BUGZILLA_URL` consistent with your access URL.

---

## Troubleshooting

### Cannot access web UI

    docker psdocker logs bugzilla

### Database connection issues

- Ensure `db` container is running
- Check `DB_HOST=db`
- Verify credentials match MySQL config

### Blank page or redirect issues

- Confirm `BUGZILLA_URL=http://localhost:8080`
- Clear browser cache or try incognito mode
