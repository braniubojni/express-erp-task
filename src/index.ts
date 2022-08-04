import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { dataSource } from './db-connect';
import { router } from './router';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(router);

const start = async () => {
  try {
    const PORT = process.env.PORT || 7000;
    await dataSource.initialize();
    app.listen(PORT, () => console.log(`Server on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
