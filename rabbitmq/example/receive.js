import amqp from "amqplib";

const queue = "hello";

async function receiveMessage() {
  try {
    const connection = await amqp.connect("amqp://admin:admin@localhost");
    const channel = await connection.createChannel();

    await channel.assertQueue(queue, {durable: false});
    console.log(`[*] Waiting for messages in ${queue}. Press CTRL+C to exit.`);

    channel.consume(queue, (msg) => {
      if (msg !== null) {
        console.log(`[x] Received: ${msg.content.toString()}`);
        channel.ack(msg);
      }
    });
  } catch (error) {
    console.error("Error receiving message:", error);
  }
}

receiveMessage();
