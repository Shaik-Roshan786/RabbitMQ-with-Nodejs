const amqp = require("amqplib");

const msg = {number: process.argv[2]}

connect();


async function connect() {

    try {
        const amqpServer = "amqp://localhost:5672" // URL of the RabbitMQ server to connect to
        const connection = await amqp.connect(amqpServer) // Establish a connection to the RabbitMQ server using the URL
        const channel = await connection.createChannel(); // Create a channel within the established connection.
        await channel.assertQueue("jobs");// Assert the existence of a queue named "jobs". If the queue doesn't exist, it will be created.
        

        // Use the 'channel' object to send a message to the "jobs" queue.
        // The message is a JSON stringified representation of the 'msg' object.
        // 'Buffer.from' converts the string to a buffer.
        await channel.sendToQueue("jobs", Buffer.from(JSON.stringify(msg)))
        console.log(`Job sent successfully ${msg.number}`);
        await channel.close();// Close the channel. This is done to clean up and free resources after sending the message.
        await connection.close();// Close the connection to the RabbitMQ server. This is done to release the connection resources and close the connection gracefully.
    }
    catch (ex){
        console.error(ex)
    }

}