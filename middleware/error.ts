import { Request, Response } from 'express';
import Logger from "../services/Logger";
import { HttpStatusCode } from "../utils/constants";


const AppError = require('../utils/AppError');

module.exports = function(err: { message: string; details: { message: string; }[]; }, _req: Request, res: Response){
		if (err) {
			Logger.error(`server side error => ${err?.details?.[0]?.message || err}`);
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(new AppError(err?.details?.[0]?.message || err, HttpStatusCode.INTERNAL_SERVER_ERROR));
		}
}
