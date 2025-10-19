/* eslint-disable linebreak-style */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable linebreak-style */

const amqp = require('amqplib');

const producerService = {
  sendMessage: async (queque, message) => {
    const connection = await amqp.connect(process.env.RABBITMQ_SERVER);
    const channel = connection.createChannel();
    (await channel).assertQueue(queque, {
      durable: true,
    });

    (await channel).sendToQueue(queque, Buffer.from(message));

    setTimeout(() => {
      connection.close();
    }, 1000);
  },
};

module.exports = producerService;
