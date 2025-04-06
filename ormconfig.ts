const envPath = `.env.${process.env.NODE_ENV || 'development'}`;
console.log('Loading env from:', envPath);

const dotenv = require('dotenv');
const result = dotenv.config({
  path: envPath,
});

if (result.error) {
  console.error('Error loading .env file:', result.error);
}

import { DataSource, DataSourceOptions } from 'typeorm';

const { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_NAME, NODE_ENV } =
  process.env;

if (!DB_HOST || !DB_USERNAME || !DB_PASSWORD || !DB_NAME) {
  throw new Error('Missing required database environment variables');
}

console.log('DB_PASSWORD: ', DB_PASSWORD);
export const options: DataSourceOptions = {
  type: 'postgres',
  host: DB_HOST,
  port: DB_PORT ? +DB_PORT : 5432,
  username: DB_USERNAME,
  password: DB_PASSWORD,
  database: DB_NAME,
  migrationsTableName: 'migrations',
  migrations: [],
  synchronize: NODE_ENV !== 'production',
};

export const AppDataSource = new DataSource(options);
