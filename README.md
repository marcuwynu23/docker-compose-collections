<h1 align="center">Docker Compose Collections</h1>

<p align="center">
  Ready-to-use Docker Compose stacks for development and self-hosted services.
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/stacks-docker_compose-informational" alt="Docker Compose Stacks">
  <img src="https://img.shields.io/badge/runtime-Docker%20%7C%20Podman-0db7ed" alt="Runtime: Docker or Podman">
</p>

## Overview

This repository is a practical collection of Compose-based setups for common infrastructure and developer tooling.  
Each folder contains a service stack you can run quickly and customize for your environment.

## What You Will Find

- Pre-configured Compose files for common services and tooling
- Stack examples with persistent storage and environment variables
- Service-specific README files with setup, usage, and operational notes
- Configurations that are easy to adapt for local labs and small deployments

## Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/marcuwynu23/docker-compose-collections.git
   ```
2. Enter a stack directory:
   ```bash
   cd docker-compose-collections/<stack-folder>
   ```
3. Start services:
   ```bash
   docker compose up -d
   # when needed:
   docker compose up -d --env-file .env
   ```
4. Stop services:
   ```bash
   docker compose down
   ```

## Podman Support

Most stacks can also run with Podman:

```bash
podman compose up -d
# when needed:
podman compose up -d --env-file .env
podman compose down
```

Note: stacks that require `/var/run/docker.sock` may need Docker-compatible socket configuration when running on Podman.

## Available Stacks

| Stack | Description | Primary Use Case |
|---|---|---|
| [`activepieces`](activepieces/README.md) | Workflow automation platform with Redis/PostgreSQL backend. | Build no-code/low-code business automations. |
| [`adminer`](adminer/README.md) | Lightweight web database management UI. | Quick SQL/admin tasks across supported databases. |
| [`authentik`](authentik/README.md) | Open-source IdP and SSO platform. | Central authentication and SSO for internal apps. |
| [`code-server`](code-server/README.md) | VS Code in the browser. | Remote development environment accessible via web. |
| [`custom-linux-distr-base-arch`](custom-linux-distr-base-arch/README.md) | Arch Linux container for custom distro/ISO work. | Build and test custom Linux base images/ISOs. |
| [`devpi`](devpi/README.md) | Private Python package index and cache. | Cache and publish internal Python packages. |
| [`dozzle`](dozzle/README.md) | Lightweight live container log viewer UI. | Quickly inspect runtime logs across containers. |
| [`elasticsearch`](elasticsearch/README.md) | Search and analytics engine (single-node setup). | Full-text search, logs indexing, and analytics. |
| [`grafana-loki-promtail`](grafana-loki-promtail/README.md) | Centralized log stack with Grafana and Loki. | Collect, query, and visualize logs in one place. |
| [`gitea`](gitea/README.md) | Lightweight self-hosted Git service. | Internal source control hosting. |
| [`gitea+jenkins`](gitea+jenkins/README.md) | Combined Git hosting and CI stack. | End-to-end local Git + build pipeline flow. |
| [`harbor`](harbor/README.md) | Container registry platform scaffold and setup docs. | Enterprise-style private image registry workflows. |
| [`jenkins`](jenkins/README.md) | Automation server for CI/CD pipelines. | Build, test, and deploy pipelines. |
| [`jmeter`](jmeter/README.md) | Apache JMeter headless load testing. | API/web performance and load testing. |
| [`localstack`](localstack/README.md) | Local AWS service emulation. | Develop/test cloud integrations offline. |
| [`mailpit`](mailpit/README.md) | Local SMTP testing server with inbox UI. | Validate app email flows without external SMTP. |
| [`miniio`](miniio/README.md) | S3-compatible object storage server. | Local object storage for apps and backups. |
| [`n8n`](n8n/README.md) | Workflow automation with local storage. | Event-driven integrations and process automation. |
| [`n8n+postgresql`](n8n+postgresql/README.md) | n8n with PostgreSQL persistence. | More reliable n8n deployment for larger workloads. |
| [`nessus`](nessus/README.md) | Vulnerability scanning platform. | Security assessment and host vulnerability scans. |
| [`nginx-proxy-manager`](nginx-proxy-manager/README.md) | Reverse proxy manager with UI and SSL support. | Route domains to services with easy TLS setup. |
| [`ollama`](ollama/README.md) | Local LLM serving API. | Run and test local AI models privately. |
| [`openclaw`](openclaw/README.md) | OpenClaw gateway/control UI stack. | Local AI gateway and control interface experiments. |
| [`pihole`](pihole/README.md) | Network-wide DNS ad/tracker blocker. | Block ads and trackers for all network devices. |
| [`portainer`](portainer/README.md) | Docker management UI. | Visual container/stack management. |
| [`prometheus-grafana`](prometheus-grafana/README.md) | Prometheus + Grafana monitoring baseline. | Metrics collection and dashboard visualization. |
| [`prometheus-grafana-kubenetes`](prometheus-grafana-kubenetes/README.md) | Prometheus + Grafana for Kubernetes metrics targets. | Kubernetes node/cAdvisor monitoring. |
| [`prometheus-grafana-proxmox`](prometheus-grafana-proxmox/README.md) | Prometheus + Grafana + Proxmox exporter stack. | Proxmox cluster observability. |
| [`prometheus-opentelemetry-jaegerui`](prometheus-opentelemetry-jaegerui/README.md) | Metrics/traces observability stack. | End-to-end telemetry and trace visualization. |
| [`rabbitmq`](rabbitmq/README.md) | Message broker with management UI. | Asynchronous messaging between services. |
| [`registry`](registry/README.md) | Private OCI/Docker registry service. | Store and distribute container images internally. |
| [`sonarqube`](sonarqube/README.md) | Code quality and security analysis platform. | Static analysis and quality gates in CI. |
| [`traefik`](traefik/README.md) | Dynamic reverse proxy and ingress controller. | Route HTTP/HTTPS traffic to service stacks. |
| [`trivy`](trivy/README.md) | Vulnerability scanning server with optional web UI. | Scan container images and filesystems for CVEs. |
| [`twake`](twake/drive/README.md) | Twake Drive collaboration/storage stack. | Self-hosted file collaboration and sharing. |
| [`uptime-kuma`](uptime-kuma/README.md) | Uptime monitoring and status pages. | Service health checks and incident visibility. |
| [`vault`](vault/README.md) | HashiCorp Vault (dev-mode stack). | Secrets management and secure token workflows. |
| [`verdaccio`](verdaccio/README.md) | Private npm registry and proxy cache. | Publish/cache JavaScript packages internally. |
| [`woodpecker-ci`](woodpecker-ci/README.md) | Lightweight self-hosted CI server and agent. | Git-based CI pipelines with Docker runner. |
| [`xampp`](xampp/README.md) | PHP + MySQL local web stack. | Legacy PHP app development/testing environment. |

## Contributing

Contributions are welcome.  
If you want to add or improve a stack, open a pull request with a short description of the use case and configuration.

## License

This project is licensed under the MIT License.
