import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, '.env') });

interface EnvVariables {
  PORT: string;
  MONGODB_CONNECTION_STRING: string;
  JWT_SECRET_KEY: string;
  REDIS_HOST: string;
  REDIS_PORT: string;
  AMQP_URL: string;
}

const getEnvVariable = (key: keyof EnvVariables): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
};

export const env: EnvVariables = {
  PORT: getEnvVariable('PORT'),
  MONGODB_CONNECTION_STRING: getEnvVariable('MONGODB_CONNECTION_STRING'),
  JWT_SECRET_KEY: getEnvVariable('JWT_SECRET_KEY'),
  REDIS_HOST: getEnvVariable('REDIS_HOST'),
  REDIS_PORT: getEnvVariable('REDIS_PORT'),
  AMQP_URL: getEnvVariable('AMQP_URL'),
};
