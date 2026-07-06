<p align="center">
  <img src="./banner.jpg" alt="Docker Compose Collections" style="width: 100%; max-width: 1200px;" />
</p>

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

## Available Stacks

### AI & Machine Learning

- [litellm](./litellm)
- [ollama](./ollama)

- [tesseract](./tesseract)

### Automation & Workflow

- [activepieces](./activepieces)
- [n8n](./n8n)
- [n8n+postgresql](./n8n+postgresql)
- [openclaw](./openclaw)

### Alerts & Notifications

- [apprise](./apprise)

### Social Media & Marketing Tools

- [listmonk](./listmonk)
- [mixpost](./mixpost)
- [postiz](./postiz)

### CI/CD & DevOps

- [floci](./floci)
- [gitea](./gitea)
- [gitea+jenkins](./gitea+jenkins)
- [jenkins](./jenkins)
- [semaphore](./semaphore)
- [sonarqube](./sonarqube)
- [ansible](./ansible)
- [chef](./chef)
- [openstack](./openstack)
- [opentofu](./opentofu)
- [consul](./consul)
- [puppet](./puppet)
- [woodpecker-ci](./woodpecker-ci)

### Knowledge Management

- [affine](./affine)
- [logseq](./logseq)
- [siyuan](./siyuan)

### Document Editor and Management

- [overleaf](./overleaf)
- [stirling-pdf](./stirling-pdf)

### Collaboration & Project Management

- [atlassian-jira](./atlassian-jira)
- [bitbucket](./bitbucket)
- [bugzilla](./bugzilla)
- [mattermost](./mattermost)
- [openproject](./openproject)
- [plane](./plane)
- [rocket-chat](./rocket-chat)
- [taiga](./taiga)
- [twake](./twake)

### Databases & Storage

- [adminer](./adminer)
- [cassandra](./cassandra)
- [couchdb](./couchdb)
- [dbx](./dbx)
- [documentdb](./documentdb)
- [meilisearch](./meilisearch)
- [neo4j](./neo4j)
- [miniio](./miniio)
- [mongodb-replicaset](./mongodb-replicaset)
- [mongodb-sharding-cluster](./mongodb-sharding-cluster)
- [parse-server+mongodb](./parse-server+mongodb)
- [postgrest](./postgrest)
- [redis](./redis)
- [supabase](./supabase)
- [vectordb](./vectordb)

### Message Brokers & Queuing

- [kafka](./kafka)
- [automq](./automq)
- [pulsar](./pulsar)
- [rabbitmq](./rabbitmq)

### Development Tools

- [backstage](./backstage)
- [code-server](./code-server)
- [devpi](./devpi)
- [it-tools](./it-tools)
- [jmeter](./jmeter)
- [localstack](./localstack)
- [portabase](./portabase)
- [registry](./registry)
- [scalar](./scalar)
- [swaggerui-openapi](./swaggerui-openapi)
- [verdaccio](./verdaccio)
- [xampp](./xampp)
- [wordpress](./wordpress)

### Infrastructure & Security

- [authentik](./authentik)
- [dvwa](./dvwa)
- [juice-shop](./juice-shop)
- [keycloak](./keycloak)
- [nessus](./nessus)
- [pihole](./pihole)
- [portainer](./portainer)
- [trivy](./trivy)
- [snyk](./snyk)
- [vault](./vault)

### Load Balancers & Reverse Proxies

- [caddy](./caddy)
- [envoy](./envoy)
- [haproxy](./haproxy)
- [kong](./kong)
- [krakend](./krakend)
- [nginx-proxy-manager](./nginx-proxy-manager)
- [traefik](./traefik)

### Monitoring & Observability

- [alertmanager](./alertmanager)
- [dozzle](./dozzle)
- [elasticsearch](./elasticsearch)
- [elasticsearch-kibana-filebeat](./elasticsearch-kibana-filebeat)
- [fluentbit](./fluentbit)
- [grafana-opentelemetry-tempo](./grafana-opentelemetry-tempo)
- [grafana-prometheus](./grafana-prometheus)
- [grafana-prometheus-alertmanager](./grafana-prometheus-alertmanager)
- [grafana-prometheus-krakend](./grafana-prometheus-krakend)
- [grafana-prometheus-kubenetes](./grafana-prometheus-kubenetes)
- [grafana-prometheus-loki-opentelemetry-tempo](./grafana-prometheus-loki-opentelemetry-tempo)
- [grafana-prometheus-loki-promtail](./grafana-prometheus-loki-promtail)
- [grafana-prometheus-mongodb](./grafana-prometheus-mongodb)
- [grafana-prometheus-node](./grafana-prometheus-node)
- [grafana-prometheus-opentelemetry-jaegerui](./grafana-prometheus-opentelemetry-jaegerui)
- [grafana-prometheus-proxmox](./grafana-prometheus-proxmox)
- [uptime-kuma](./uptime-kuma)
- [sentry](./sentry)

### Backups

- [restic](./restic)

### Visual Management

- [draw.io](./draw.io)
- [penpot](./penpot)

### Other Services

- [filebrowser](./filebrowser)
- [mailpit](./mailpit)
- [custom-linux-distr-base-arch](./custom-linux-distr-base-arch)

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

## Contributing

Contributions are welcome.  
If you want to add or improve a stack, open a pull request with a short description of the use case and configuration.

## License

This project is licensed under the MIT License.
