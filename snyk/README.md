# Snyk

Snyk is a developer-first security tool that scans code, dependencies, containers, and infrastructure as code for vulnerabilities.  
It integrates into your workflow to find and fix issues early.

## How Snyk works

1. Snyk authenticates using your personal or service account token.
2. It scans your project files, container images, or IaC configs for known vulnerabilities.
3. Results are reported with severity, affected package, and remediation advice.
4. You can run scans locally, in CI/CD, or monitor projects continuously via the Snyk platform.

## Stack details in this repo

- Image: `snyk/snyk:docker`
- Container name: `snyk`
- Working directory (inside container): `/app`
- Volumes: mounts current directory to `/app` and Docker socket for container scanning

## Environment variables

Set via `.env` (copy from `.env.example`):

- `SNYK_TOKEN` — your Snyk API token (get it from [Snyk Account Settings](https://app.snyk.io/account))

## How to run

From the repository root:

```bash
cd snyk
cp .env.example .env
# Edit .env and set your SNYK_TOKEN
docker compose run --rm snyk test
```

Common commands:

```bash
# Test current project for vulnerabilities
docker compose run --rm snyk test

# Test a Docker image
docker compose run --rm snyk container test <image-name>

# Monitor project (sends snapshot to Snyk dashboard)
docker compose run --rm snyk monitor

# Authenticate interactively
docker compose run --rm snyk auth
```

## Use it effectively

- Run `snyk test` in CI pipelines to catch vulnerabilities before merging.
- Use `snyk container test` to scan your Docker images for OS and app-level issues.
- Combine with `snyk monitor` to track new vulnerabilities over time in the Snyk dashboard.

## Notes

- Keep your `SNYK_TOKEN` secret — do not commit `.env` to version control.
- The Docker socket mount is required for container scanning; remove it if you only scan code dependencies.
- Free tier includes limited tests per month; check [Snyk pricing](https://snyk.io/plans/) for details.
