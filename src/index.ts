import 'dotenv/config'
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mysql from 'mysql2';
import { createConnection } from 'typeorm'
import { dataSource } from './db-connect';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const start = async () => {
	try {
		const PORT = process.env.PORT || 7000;
		await dataSource.initialize();
		app.listen(PORT, () => console.log(`Server on port ${PORT}`));
	} catch (error) {
		console.log(error);
	}
}

start();