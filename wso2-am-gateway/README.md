# WSO2 API Manager with Separate Gateway Runtime

This Docker Compose setup demonstrates a **WSO2 API Manager 4.7.0** deployment with a **separate Gateway runtime**, similar to the **IBM API Connect / DataPower** architecture pattern where the control plane (management, publisher, developer portal) is decoupled from the data plane (gateway runtime).

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        Control Plane (wso2-am)                  │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌───────────┐ │
│  │  Publisher  │ │ Dev Portal  │ │ Key Manager │ │ Traffic   │ │
│  │             │ │             │ │             │ │ Manager   │ │
│  └─────────────┘ └─────────────┘ └─────────────┘ └───────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                    Configuration Sync / Event Hub
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Plane (wso2-gateway)                  │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                    Gateway Runtime                          │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────┐   │ │
│  │  │  HTTP    │ │  HTTPS   │ │  Throttle│ │  Token       │   │ │
│  │  │  8280    │ │  8243    │ │  Engine  │ │  Validation  │   │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └──────────────┘   │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        Backend Services (app)                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │              Node.js Orders API (Port 3000)                 │ │
│  └─────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
```

## Components

| Component | Image | Ports | Description |
|-----------|-------|-------|-------------|
| **wso2-am** | `wso2/wso2am:4.7.0` | 9443 (HTTPS), 9763 (HTTP), 8243 (Gateway HTTPS) | Control Plane - API Publisher, Developer Portal, Key Manager, Traffic Manager |
| **wso2-gateway** | `wso2/wso2am:4.7.0` | 8280 (HTTP), 8243 (HTTPS) | Gateway Runtime - Handles API traffic, throttling, token validation |
| **app** | Custom Node.js | 3000 | Sample backend service |

## Quick Start

### Prerequisites
- Docker Desktop or Docker Engine 20.10+
- Docker Compose 2.0+
- At least 4GB RAM available for containers

### Start the Stack

```bash
docker-compose up -d
```

### Verify Services

```bash
# Check container status
docker-compose ps

# View logs
docker-compose logs -f wso2-am
docker-compose logs -f wso2-gateway
docker-compose logs -f app
```

### Access URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| **API Publisher** | https://localhost:9443/publisher | admin / admin |
| **Developer Portal** | https://localhost:9443/devportal | admin / admin |
| **Admin Console** | https://localhost:9443/carbon | admin / admin |
| **Gateway (HTTPS)** | https://localhost:8243 | - |
| **Gateway (HTTP)** | http://localhost:8280 | - |
| **Backend API** | http://localhost:3000/api/orders | - |

## Configuration

### Control Plane (`conf/am/deployment.toml`)

The control plane runs with all profiles enabled:
- **Publisher** - API lifecycle management
- **Developer Portal** - API consumption and subscription
- **Key Manager** - OAuth2/OIDC token management
- **Traffic Manager** - Throttling and analytics
- **Gateway** - Embedded (but we use separate gateway)

Key configurations:
- Database: H2 (embedded) for simplicity
- Gateway Environment: "Default" (hybrid type)
- CORS: Enabled for all origins
- JWT Token Issuer: Extended JWT

### Gateway Runtime (`conf/gateway/deployment.toml`)

The gateway runs in **gateway-only profile** connecting to control plane:
- **Service URL**: Points to `wso2-am:9443/services/`
- **Key Manager**: Connects to control plane for token validation
- **Throttling**: Connects to control plane's Traffic Manager (JMS/TCP)
- **Event Sync**: Receives deployment events from control plane

Key configurations:
- Gateway Type: Regular (WSO2 native)
- Environment: Production
- Ports: HTTP 8280, HTTPS 8243
- Token Cache: Enabled (15 min TTL)
- Throttling: Enabled with load-balanced TM endpoints

## API Deployment

### Option 1: Via Publisher UI (Recommended)

1. Login to Publisher: https://localhost:9443/publisher
2. Create new REST API → "Orders API"
3. Context: `/orders`
4. Backend: `http://app:3000`
5. Deploy to "Default" gateway environment
6. Subscribe via Developer Portal
7. Invoke via Gateway: `curl -k -H "Authorization: Bearer <token>" https://localhost:8243/orders/1.0.0/orders/1`

### Option 2: Via Artifacts (Synapse Config)

Pre-defined API artifact in `artifacts/api/OrderAPI.xml`:
- This is a Micro Integrator style synapse config
- For API Manager Gateway, use Publisher UI or REST API

### Option 3: Via REST API (CI/CD)

```bash
# Create API via REST API
curl -k -X POST -u admin:admin \
  -H "Content-Type: application/json" \
  -d '{"name":"OrdersAPI","context":"/orders","version":"1.0.0","provider":"admin","endpointConfig":"{\"production_endpoints\":{\"url\":\"http://app:3000\"},\"sandbox_endpoints\":{\"url\":\"http://app:3000\"}}","endpointSecurity":"none"}' \
  https://localhost:9443/api/am/publisher/v4/apis
```

## Testing the Gateway

### 1. Health Check
```bash
curl -k https://localhost:8243/services/echo
```

### 2. Get Token (Client Credentials)
```bash
# First create application in Dev Portal, then:
curl -k -X POST \
  -H "Authorization: Basic <base64(client_id:client_secret)>" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "grant_type=client_credentials" \
  https://localhost:8243/token
```

### 3. Invoke API via Gateway
```bash
curl -k -H "Authorization: Bearer <access_token>" \
  https://localhost:8243/orders/1.0.0/orders/1
```

Expected response:
```json
{"id":1,"product":"Laptop","amount":1200}
```

## API Connect / DataPower Comparison

| Aspect | IBM API Connect / DataPower | WSO2 APIM + Gateway |
|--------|----------------------------|---------------------|
| **Control Plane** | API Manager (Management, Portal, Catalog) | WSO2 API Manager (Publisher, DevPortal, KeyManager) |
| **Data Plane** | DataPower Gateway | WSO2 API Gateway (Regular/APK/Envoy) |
| **Sync Mechanism** | Management plane → Gateway via config sync | Event-driven deployment sync + JMS for throttling |
| **Token Validation** | DataPower validates against OAuth server | Gateway validates via KeyManager service calls + cache |
| **Throttling** | DataPower local + centralized | Gateway local + Traffic Manager (JMS) |
| **Protocol Support** | HTTP, HTTPS, MQ, TCP, etc. | HTTP, HTTPS, WebSocket, gRPC, GraphQL |

## Production Considerations

### Databases
Replace H2 with production databases:
```toml
[database.apim_db]
type = "postgre"
url = "jdbc:postgresql://postgres:5432/apim_db"
username = "apim_user"
password = "secure_password"
```

### High Availability
- Run multiple gateway replicas behind load balancer
- Use shared database for token/throttling persistence
- Configure Traffic Manager cluster

### Security
- Use proper certificates (not self-signed)
- Enable mutual TLS for service-to-service
- Configure WAF rules in gateway

### Monitoring
- Enable Moesif analytics: `[apim.analytics] enable = true`
- Add Prometheus/Grafana for metrics
- Configure distributed tracing (OpenTelemetry)

## Troubleshooting

### Gateway not syncing APIs
```bash
# Check gateway logs for connection to control plane
docker-compose logs wso2-gateway | grep -i "sync\|deployment\|event"

# Verify control plane service URL is accessible from gateway
docker-compose exec wso2-gateway curl -k https://wso2-am:9443/services/
```

### Token validation failing
```bash
# Check key manager connectivity
docker-compose exec wso2-gateway curl -k -u admin:admin https://wso2-am:9443/services/OAuth2TokenValidationService
```

### Throttling not working
```bash
# Verify JMS connection to Traffic Manager
docker-compose logs wso2-gateway | grep -i "throttle\|jms\|traffic"
```

## Directory Structure

```
wso2-am-gateway/
├── docker-compose.yml           # Main orchestration
├── README.md                    # This file
├── app/                         # Backend service
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── conf/
│   ├── am/                      # Control plane config
│   │   └── deployment.toml
│   └── gateway/                 # Gateway runtime config
│       └── deployment.toml
└── artifacts/
    └── api/                     # Synapse API artifacts (optional)
        └── OrderAPI.xml
```

## License

This setup uses WSO2 API Manager under Apache 2.0 License.
WSO2 Docker images: https://github.com/wso2/docker-apim