# Kafka

Apache Kafka is a distributed streaming platform for building real-time data pipelines and streaming applications.  
Producers publish messages to topics, and consumers subscribe to topics to process messages in real-time.

## How Kafka works

1. Producers publish messages to Kafka topics.
2. Kafka stores messages in partitions across brokers for scalability and fault tolerance.
3. Consumers subscribe to topics and process messages from partitions.
4. The Kafka UI provides a web interface to manage topics, view messages, and monitor cluster health.

## Stack details in this repo

- Kafka Image: `apache/kafka:3.8.0`
- Kafka UI Image: `provectuslabs/kafka-ui:latest`
- Kafka container name: `kafka`
- Kafka UI container name: `kafka-ui`
- Kafka port: `9092`
- Kafka UI: `http://<host-ip>:8080`

## Environment variables

The setup uses KRaft mode (Kafka without ZooKeeper) with the following key configurations:

- `KAFKA_NODE_ID`: Node identifier (set to 1)
- `KAFKA_PROCESS_ROLES`: broker,controller (combined mode)
- `KAFKA_LISTENERS`: Internal and external listener configurations
- `KAFKA_ADVERTISED_LISTENERS`: How clients connect to Kafka
- `CLUSTER_ID`: Unique cluster identifier

## How to run

From the repository root:

```bash
cd kafka
docker compose up -d
```

Open:

- Kafka UI: `http://localhost:8080`

Useful commands:

```bash
docker compose ps
docker compose logs -f kafka
docker compose logs -f kafka-ui
docker compose restart
docker compose down
```

## Use it effectively

- Create topics from the Kafka UI for quick testing.
- Use the UI to browse messages, monitor consumer lag, and view partition details.
- Connect applications to `localhost:9092` for external access or `kafka:29092` from within Docker network.
- Monitor topic throughput and consumer group performance through the UI.

## Basic Kafka operations

This repository includes JavaScript examples using KafkaJS for easier development and testing:

```bash
# Install dependencies
npm install

# Create and manage topics
npm run create-topic    # Creates test-topic with 3 partitions
npm run list-topics     # Lists all available topics
node kafka-topics.js delete test-topic  # Delete a specific topic

# Start interactive producer (type messages and press Enter)
npm run producer

# Start consumer (displays incoming messages in real-time)
npm run consumer
```

**JavaScript files included:**

- `kafka-topics.js` - Topic management (create, list, delete)
- `kafka-console-producer.js` - Interactive message producer
- `kafka-console-consumer.js` - Real-time message consumer
- `package.json` - Node.js project with KafkaJS dependency

## Notes

- This setup uses KRaft mode (Kafka without ZooKeeper) for simplified deployment.
- Port `9092` should be reachable by applications that produce or consume messages.
- The internal port `29092` is used for inter-container communication.
- Replication factor is set to 1 for single-node development setup.
- For production use, consider running multiple Kafka brokers and adjusting replication factors.
