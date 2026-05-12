const {Kafka} = require("kafkajs");
const readline = require("readline");

const kafka = Kafka({
  clientId: "kafka-producer-app",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function startProducer() {
  try {
    await producer.connect();
    console.log("Connected to Kafka producer");
    console.log('Type messages to send to "test-topic" (type "exit" to quit):');

    rl.on("line", async (input) => {
      if (input.toLowerCase() === "exit") {
        await cleanup();
        return;
      }

      try {
        await producer.send({
          topic: "test-topic",
          messages: [
            {
              key: `key-${Date.now()}`,
              value: input,
              timestamp: Date.now().toString(),
            },
          ],
        });
        console.log(`Message sent: "${input}"`);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });
  } catch (error) {
    console.error("Error connecting to Kafka:", error);
    await cleanup();
  }
}

async function cleanup() {
  try {
    await producer.disconnect();
    console.log("Disconnected from Kafka producer");
    rl.close();
    process.exit(0);
  } catch (error) {
    console.error("Error during cleanup:", error);
    process.exit(1);
  }
}

// Handle process termination
process.on("SIGINT", cleanup);
process.on("SIGTERM", cleanup);

// Start the producer
startProducer();
