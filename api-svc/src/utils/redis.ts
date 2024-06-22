import Redis, { Redis as RedisClient } from 'ioredis';
import { env } from '../config'; // Adjust the import path as per your project structure

interface RedisConfig {
  REDIS_HOST: string;
  REDIS_PORT: number;
}

const config: RedisConfig = {
  REDIS_HOST: env.REDIS_HOST,
  REDIS_PORT: Number(env.REDIS_PORT),
};

const getClient = (): RedisClient => {
  const client = new Redis({
    host: config.REDIS_HOST,
    port: config.REDIS_PORT,
  });

  client.on('ready', () => {
    console.log('redis is ready ✅');
  });

  client.on('connect', () => {
    console.log('redis connection established ✅');
  });

  client.on('reconnecting', () => {
    console.log('redis reconnecting ⏳');
  });

  client.on('error', (error: any) => {
    console.error('redis error occurred 🚩', error);
  });

  client.on('end', () => {
    console.error('redis connection ended 💔');
  });

  return client;
};

const redisClient = getClient();

export const getCachedData = async (key: string) => {
  try {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error(`Error fetching data from Redis for key ${key}:`, error);
    return null;
  }
};

export const setCachedData = async (key: string, value: any, ttl: number) => {
  try {
    await redisClient.set(key, JSON.stringify(value), 'EX', ttl);
    console.log(`Data cached with key ${key} for ${ttl} seconds.`);
  } catch (error) {
    console.error(`Error setting data in Redis for key ${key}:`, error);
  }
};

export const deleteCachedData = async (key: string) => {
  try {
    await redisClient.del(key);
    console.log(`Data for key ${key} has been deleted from Redis.`);
  } catch (error) {
    console.error(`Error deleting data from Redis for key ${key}:`, error);
  }
};

export default redisClient;
