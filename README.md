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

## Contributing

Contributions are welcome.  
If you want to add or improve a stack, open a pull request with a short description of the use case and configuration.

## License

This project is licensed under the MIT License.
