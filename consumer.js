const amqp = require("amqplib");

connect();
async function connect() {

    try {
        const amqpServer = "amqp://localhost:5672"//URL of the RabbitMQ server (localhost on port 5672).
        const connection = await amqp.connect(amqpServer) // Connect to the RabbitMQ server using the specified URL and get the connection object.
        const channel = await connection.createChannel();// Create a channel to interact with RabbitMQ.
        await channel.assertQueue("jobs");// Assert the existence of a queue named "jobs". If the queue does not exist, it will be created.
        
        channel.consume("jobs", message => {  // Start consuming messages from the "jobs" queue.
            const input = JSON.parse(message.content.toString());   // Parse the consumed message content as JSON.
            console.log(`Recieved job with input ${input.number}`)

            if (input.number == 7 ) 
                channel.ack(message);
        })

        console.log("Waiting for messages...")
    
    }
    catch (ex){
        console.error(ex)
    }

}