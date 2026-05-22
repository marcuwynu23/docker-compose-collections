# Apprise API

Apprise is a push notification library that supports 80+ notification services.  
This setup runs the Apprise API server for sending notifications.

## How it works

```mermaid
flowchart LR
    App([Application]) -->|:8000| Apprise[Apprise API]
    Apprise -->|:notifications| Services[80+ Services]
```

1. Apprise API exposes a RESTful interface on port `8000`.
2. Send notifications to various services (Slack, Discord, Telegram, Email, etc.).
3. Configuration is loaded from `/config/apprise.yml`.

## Stack details in this repo

- Apprise image: `caronc/apprise:latest`
- API endpoint: `http://<host-ip>:8000`
- Configuration file: `./apprise/config/apprise.yml`
- Persistent data: None (stateless API)

## Environment variables

Copy `.env.example` to `.env` if needed for custom configuration.

## Configuration

Create your `apprise.yml` file in `./apprise/config/` with your notification service credentials:

```yaml
urls:
  - slack://token@channel
  - discord://webhook_id/webhook_token
  - telegram://bot_token@chat_id
```

## How to run

From the repository root:

```bash
cd apprise
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

## Rotation Notes

- Regularly review and rotate notification service tokens/credentials.
- Use environment variables or secrets management for sensitive credentials.
- Monitor API logs for failed notification attempts.
- Consider implementing a notification retry mechanism for critical alerts.
