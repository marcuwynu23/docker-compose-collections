const {Kafka} = require("kafkajs");

const kafka = Kafka({
  clientId: "kafka-topics-app",
  brokers: ["localhost:9092"],
});

const admin = kafka.admin();

async function createTopic() {
  try {
    await admin.connect();
    console.log("Connected to Kafka admin");

    // Create topic
    await admin.createTopics({
      topics: [
        {
          topic: "test-topic",
          numPartitions: 3,
          replicationFactor: 1,
        },
      ],
    });
    console.log('Topic "test-topic" created successfully');

    // List topics
    const topics = await admin.listTopics();
    console.log("Available topics:", topics);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await admin.disconnect();
    console.log("Disconnected from Kafka admin");
  }
}

async function listTopics() {
  try {
    await admin.connect();
    console.log("Connected to Kafka admin");

    const topics = await admin.listTopics();
    console.log("Available topics:", topics);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await admin.disconnect();
    console.log("Disconnected from Kafka admin");
  }
}

async function deleteTopic(topicName) {
  try {
    await admin.connect();
    console.log("Connected to Kafka admin");

    await admin.deleteTopics({
      topics: [topicName],
    });
    console.log(`Topic "${topicName}" deleted successfully`);
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await admin.disconnect();
    console.log("Disconnected from Kafka admin");
  }
}

// Command line usage
const command = process.argv[2];
const topicName = process.argv[3];

switch (command) {
  case "create":
    createTopic();
    break;
  case "list":
    listTopics();
    break;
  case "delete":
    if (!topicName) {
      console.error(
        "Please provide topic name: node kafka-topics.js delete <topic-name>",
      );
      process.exit(1);
    }
    deleteTopic(topicName);
    break;
  default:
    console.log("Usage:");
    console.log("  node kafka-topics.js create    - Create test-topic");
    console.log("  node kafka-topics.js list      - List all topics");
    console.log("  node kafka-topics.js delete <topic-name> - Delete a topic");
}
