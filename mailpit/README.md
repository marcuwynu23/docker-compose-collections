# Mailpit

Mailpit is a local SMTP testing server with web inbox UI.

## How it works

1. Apps send email to Mailpit SMTP port.
2. Mailpit captures messages instead of sending externally.
3. You inspect messages in web UI.

## Stack details

- Image: `axllent/mailpit:latest`
- SMTP: `1025`
- UI: `8025`
- Optional data folder: `./data:/data`

## How to run

```bash
cd mailpit
cp .env.example .env
docker compose up -d
```

Open:
- UI: `http://localhost:8025`
- SMTP host/port for apps: `localhost:1025`

## How to use

### 1) Configure your app SMTP settings

Use these values in your application:

- SMTP host: `localhost`
- SMTP port: `1025`
- TLS/SSL: `off` (for local testing)
- Username/password: usually not required in this basic setup

### 2) Send a test email

Use the included script:

```bash
python test-mail.py
```

Or run an inline quick Python test:

```bash
python - <<'PY'
import smtplib
from email.message import EmailMessage

msg = EmailMessage()
msg["Subject"] = "Mailpit Test"
msg["From"] = "dev@example.local"
msg["To"] = "user@example.local"
msg.set_content("Hello from Mailpit.")

with smtplib.SMTP("localhost", 1025) as s:
    s.send_message(msg)

print("sent")
PY
```

### 3) Verify in Mailpit UI

Open `http://localhost:8025` and check inbox:

- message list and metadata
- HTML/text body preview
- attachments and headers

### 4) Common compose commands

```bash
docker compose ps
docker compose logs -f
docker compose down
```

Podman equivalents:

```bash
podman compose ps
podman compose logs -f
podman compose down
```
