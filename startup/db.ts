import winston from 'winston';
import mongoose from 'mongoose';
import config from 'config';
import Logger from "../services/Logger";
import AppError from "../utils/AppError";
import { HttpStatusCode } from "../utils/constants";
import { Request, Response } from 'express';

module.exports = function() {
	const db: string = config.get('db');
	mongoose.connect(db)
			.then(() => winston.info(`Connected to ${db}...`))
		.catch((err) => new AppError(`DC to ${db} ${err.message}`, HttpStatusCode.INTERNAL_SERVER_ERROR));

	mongoose.connection.on('error', (err, _req: Request, _res: Response) => {
		Logger.error(`DB Connection Error: ${err}`);

		throw(err);
	});
}
