const {Kafka} = require("kafkajs");

const kafka = Kafka({
  clientId: "kafka-consumer-app",
  brokers: ["localhost:9092"],
});

const consumer = kafka.consumer({
  groupId: "test-group",
  // Start from the beginning of the topic
  fromBeginning: true,
});

async function startConsumer() {
  try {
    await consumer.connect();
    console.log("Connected to Kafka consumer");

    await consumer.subscribe({
      topic: "test-topic",
      fromBeginning: true,
    });

    console.log('Subscribed to "test-topic". Waiting for messages...');
    console.log("Press Ctrl+C to exit");

    await consumer.run({
      eachMessage: async ({topic, partition, message}) => {
        const messageData = {
          topic,
          partition,
          offset: message.offset,
          key: message.key?.toString(),
          value: message.value?.toString(),
          timestamp: new Date(parseInt(message.timestamp)).toISOString(),
        };

        console.log("Received message:", JSON.stringify(messageData, null, 2));
      },
    });
  } catch (error) {
    console.error("Error:", error);
    await cleanup();
  }
}

async function cleanup() {
  try {
    await consumer.disconnect();
    console.log("Disconnected from Kafka consumer");
    process.exit(0);
  } catch (error) {
    console.error("Error during cleanup:", error);
    process.exit(1);
  }
}

// Handle process termination
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Start the consumer
startConsumer();
