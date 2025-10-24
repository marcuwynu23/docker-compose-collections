// send.js
import amqp from "amqplib";

const queue = "hello";
const msg = "Hello from Wynu!";

async function sendMessage() {
  try {
    const connection = await amqp.connect("amqp://admin:admin@localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {durable: false});
    channel.sendToQueue(queue, Buffer.from(msg));
    console.log(`[x] Sent: ${msg}`);

    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.error("Error sending message:", error);
  }
}

sendMessage();
