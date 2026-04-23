# OWASP Juice Shop

OWASP Juice Shop is an intentionally insecure web application for security training. It is the most modern and sophisticated insecure web application, perfect for security professionals and students to learn about web vulnerabilities.

## How it works

1. The Juice Shop container starts and initializes the Node.js application.

2. The web interface is exposed on port 3000.

## Stack details in this repo

- Image: bkimminich/juice-shop:latest
- Container name: juice-shop
- Ports:
  - 3000 (HTTP)

## How to run

From the repository root:

```bash
docker compose up -d
```

Access the application in your browser:

`http://localhost:3000`

Useful commands

```bash
docker compose ps
docker compose logs -f
docker compose restart
docker compose down
```

## Notes

- Educational Use: This application is intentionally insecure. Do not use it for production data, and do not expose this container to the public internet.

- Boot Time: The application may take 10–30 seconds to fully initialize after the container starts. If you receive a "connection refused" or empty response initially, wait a few moments and refresh your browser.
