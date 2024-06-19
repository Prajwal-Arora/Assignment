interface EnvVariables {
  PORT?: string;
  MONGODB_CONNECTION_STRING?: string;
  JWT_SECRET_KEY?: string;
  REDIS_HOST?: string;
  REDIS_PORT?: string;
  AMQP_URL?: string;
}

const {
  PORT,
  MONGODB_CONNECTION_STRING,
  JWT_SECRET_KEY,
  REDIS_HOST,
  REDIS_PORT,
  AMQP_URL,
}: EnvVariables = process.env;

export const config = {
  PORT,
  MONGODB_CONNECTION_STRING,
  JWT_SECRET_KEY,
  REDIS_HOST,
  REDIS_PORT,
  AMQP_URL,
};
