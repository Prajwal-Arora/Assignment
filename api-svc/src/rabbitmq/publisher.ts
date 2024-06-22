import { setupPublisher } from './setup';
import { exchangeName, routingKey } from './constants';
import { Channel } from 'amqplib';

async function publishMessage(message: any): Promise<void> {
  const channel: Channel = await setupPublisher();
  const messageBuffer: Buffer = Buffer.from(JSON.stringify(message));
  channel.publish(exchangeName, routingKey, messageBuffer, {
    persistent: true,
  });
  console.log(' << publish successful >> ');

  // Close channel and connection
  await channel.close();
  await channel.connection.close();
}

export { publishMessage };
