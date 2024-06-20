import { env } from '../config';

export const dbConnection = {
  url: env.MONGODB_CONNECTION_STRING,
};
