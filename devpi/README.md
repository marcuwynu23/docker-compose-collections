# devpi

devpi is a private Python package index and caching proxy for PyPI.

## How it works

1. devpi-server starts and serves package index APIs.
2. You can mirror public PyPI packages and host private packages.
3. Python clients install/publish packages through devpi endpoints.
4. Package metadata and files persist in `./data`.

## Stack details in this repo

- Image: `muccg/devpi:latest`
- Container name: `devpi`
- Endpoint: `http://<host-ip>:3141`
- Persistent data:
  - `./data:/data`

## Environment variables

Copy `.env.example` to `.env`:

- `DEVPI_PORT` (default: `3141`)

## How to run

```bash
cd devpi
cp .env.example .env
docker compose up -d
```

Podman:

```bash
cd devpi
cp .env.example .env
podman compose up -d
```

## Use devpi with pip (install + store packages)

### 1) Install devpi client tools

```bash
pip install devpi-client
```

### 2) Point client to your devpi server

```bash
devpi use http://localhost:3141
```

### 3) Login as root and create a user/index

Default root password in this image is empty on first initialization, so login with:

```bash
devpi login root --password=''
devpi user -c myuser password=mysafepassword email=myuser@example.com
devpi login myuser --password=mysafepassword
devpi index -c dev bases=root/pypi volatile=False
devpi use myuser/dev
```

### 4) Configure pip to install through devpi

Temporary (single command):

```bash
pip install --index-url http://localhost:3141/myuser/dev/+simple/ requests
```

Persistent (`pip config`):

```bash
pip config set global.index-url http://localhost:3141/myuser/dev/+simple/
```

### 5) Upload/store your own package in devpi

Build your package:

```bash
python -m build
```

Upload with twine:

```bash
pip install twine
twine upload --repository-url http://localhost:3141/myuser/dev/ dist/*
```

After upload, your package is stored in devpi and can be installed via pip from your index.

## Notes

- Great for caching dependencies in CI/CD to speed builds.
- Add auth/users before production usage.
