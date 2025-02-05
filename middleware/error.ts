import { Request, Response } from 'express';
import { httpStatusCode } from "../utils/constants";

const winston = require('winston');
const AppError = require('../utils/AppError');

module.exports = function(err: { message: string; details: { message: string; }[]; }, _req: Request, res: Response){
		winston.error(err.message, err);
		res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(new AppError(err.details[0].message, httpStatusCode.INTERNAL_SERVER_ERROR));
}
