# RabbitMQ Example using Node.js

This example demonstrates a simple **producer–consumer** setup using **RabbitMQ** and Node.js. It shows how to send and receive messages via a queue using the AMQP protocol.

## 📦 Prerequisites

Before running the example, make sure you have:

- **Docker** (or WSL with Docker) installed and running.
- **Node.js** version 16 or higher.
- RabbitMQ running locally (using the `docker-compose.yml` below).

## 🐇 Start RabbitMQ with Docker

Create a file named `docker-compose.yml`:

```yaml
services:
  rabbitmq:
    image: rabbitmq:3-management
    container_name: rabbitmq
    hostname: rabbitmq
    ports:
      - "5672:5672" # AMQP protocol
      - "15672:15672" # Management UI
    environment:
      RABBITMQ_DEFAULT_USER: admin
      RABBITMQ_DEFAULT_PASS: admin
    restart: unless-stopped
```

Then run RabbitMQ in the background:

```sh
docker compose up -d
```

Once it’s running, open the management dashboard:
👉 [http://localhost:15672](http://localhost:15672)
Use the default credentials:

```
Username: admin
Password: admin
```

---

## 📚 Install Dependencies

```sh
npm i amqplib
```

---

## ✉️ Send Message (Producer)

Create `send.js`:

```js
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
```

Run it:

```sh
node send.js
```

---

## 📬 Receive Message (Consumer)

Create `receive.js`:

```js
import amqp from "amqplib";

const queue = "hello";

async function receiveMessage() {
  try {
    const connection = await amqp.connect("amqp://admin:admin@localhost");
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, {durable: false});

    console.log("[*] Waiting for messages. To exit press CTRL+C");

    channel.consume(
      queue,
      (msg) => {
        console.log(`[x] Received: ${msg.content.toString()}`);
      },
      {noAck: true}
    );
  } catch (error) {
    console.error("Error receiving message:", error);
  }
}

receiveMessage();
```

Run it:

```sh
node receive.js
```

---

## 🔄 Workflow Summary

1. `receive.js` listens for messages on the `hello` queue.
2. `send.js` sends a message `"Hello from Wynu!"` to that queue.
3. The message immediately appears in your receiver’s console output.

---

## 🧠 Notes

- `amqplib` is the official AMQP 0-9-1 client for Node.js.
- The queue is **non-durable**, meaning messages are lost if RabbitMQ restarts (use `{ durable: true }` for persistence).
- You can explore queues, exchanges, and bindings in the RabbitMQ Management UI.

This setup forms the foundation for event-driven applications, microservice communication, and distributed systems powered by RabbitMQ.
