import { Request, Response } from 'express';
import Logger from "../services/Logger";
import { HttpStatusCode } from "../utils/constants";

const AppError = require('../utils/AppError');

module.exports = function(err: { message: string; details: { message: string; }[]; }, _req: Request, res: Response){
		Logger.error(`server side error => ${err}`);
		res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(new AppError(err.details[0].message, HttpStatusCode.INTERNAL_SERVER_ERROR));
}
