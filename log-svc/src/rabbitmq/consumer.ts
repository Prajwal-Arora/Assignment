import { queueName } from './constants';
import { setupConsumer } from './setup';
import { Channel } from 'amqplib';

async function consumeMessages(): Promise<void> {
  const channel: Channel = await setupConsumer();
  channel.consume(queueName, async (message: any) => {
    console.log(`Consumer started for queue: ${queueName} ✅`);

    const messageContent = JSON.parse(message.content.toString());
    console.log(`message - ${messageContent.data}`);

    channel.on('error', (error: any) => {
      console.error(`Channel error: ${error.message}`);
      channel.close();
      channel.connection.close();
    });

    process.on('SIGINT', () => {
      channel.close();
      channel.connection.close();
    });
  });
}

export { consumeMessages };
