import { config } from 'dotenv';
import path from 'path';

config({ path: path.resolve(__dirname, '.env') });

interface EnvVariables {
  PORT: string;
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
  AMQP_URL: getEnvVariable('AMQP_URL'),
};
