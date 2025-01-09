import { registerAs } from '@nestjs/config';

export default registerAs('config', () => ({
  apiKeyGoogle: process.env.API_KEY_GOOGLE,
  apiKey: process.env.API_KEY,
  jwtSecret: process.env.JWT_SECRET,
  mongo: {
    dbName: process.env.MONGO_DB,
    user: process.env.MONGO_INIT_DB_ROOT_USERNAME,
    password: process.env.MONGO_INIT_DB_ROOT_PASSWORD,
    host: process.env.MONGO_HOST,
    port: parseInt(process.env.MONGO_PORT, 10),
    connection: process.env.MONGO_CONNECTION,
  },
}));
