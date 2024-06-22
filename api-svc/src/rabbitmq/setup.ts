import amqp, { Channel, Connection } from 'amqplib';
import { exchangeName } from './constants';
import { env } from '../config';

/*
- Publishers attach a routing key to each message they publish.
- The message is sent to an exchange.
- The exchange uses the routing key and the exchange type to determine which queues should receive the message.
- Consumers bind to specific queues and specify binding keys to receive messages that match the routing criteria
*/

async function setupPublisher(): Promise<Channel> {
  const connection: Connection = await amqp.connect(env.AMQP_URL);
  const channel: Channel = await connection.createChannel();

  await channel.assertExchange(exchangeName, 'direct', { durable: true });
  return channel;
}

export { setupPublisher };
