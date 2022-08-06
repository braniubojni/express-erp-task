import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { dataSource } from './db-connect';
import { router } from './router';
import { json } from 'body-parser';
import errorMiddleware from './middlewares/error-middleware';

const app = express();
// Middlewares
app.use(express.json());
app.use(json());
app.use(cookieParser());
app.use(cors());
app.use(router);
app.use('/static', express.static(__dirname + '/static'));
app.use(errorMiddleware);

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
