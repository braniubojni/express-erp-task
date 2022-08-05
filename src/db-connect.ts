import { DataSource } from 'typeorm';
import { Token } from './entitys/token-entity';
import { User } from './entitys/user-entity';

export const dataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST,
  port: +(process.env.DB_PORT || 3306),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // false for production
  logging: true,
  entities: [User, Token]
});
