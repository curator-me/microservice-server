const amqp = require("amqplib");

async function connectRabbitMQ() {
  try {
    connection = await amqp.connect("amqp://rabbitmq");
    channel = await connection.createChannel();
    await channel.assertQueue("task_created", { durable: true }); // connecting to queue task_created

    console.log("Notification service is listening");
    channel.consume("task_created", (msg) => {
      // console.log(msg);
      const taskData = JSON.parse(msg.content.toString());
      // ManageNotification()
      console.log("Task recieved: ", taskData);
      channel.ack(msg);
    });
  } catch (err) {
    console.log("Error connecting: ", err);
  }
}

connectRabbitMQ()