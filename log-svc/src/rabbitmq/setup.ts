import amqp, { Channel, Connection } from 'amqplib';
import { env } from '../config';
import { exchangeName, routingKey, queueName } from './constants';

async function setupConsumer(): Promise<any> {
  try {
    const connection: Connection = await amqp.connect(env.AMQP_URL, {
      heartbeat: 60,
    });
    const channel: Channel = await connection.createChannel();
    channel.prefetch(1);
    await channel.assertExchange(exchangeName, 'direct', { durable: true });
    await channel.assertQueue(queueName, { durable: true });
    await channel.bindQueue(queueName, exchangeName, routingKey);
    return channel;
  } catch (error: any) {
    console.error('RabbitMQ connection error:', error.message);
    setTimeout(setupConsumer, 5000);
  }
}

export { setupConsumer };
