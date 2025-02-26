import { Request, Response } from "express";
import Logger from "../services/Logger";
import AppError from "../utils/AppError";
import { HttpStatusCode } from "../utils/constants";


module.exports = function(_req: Request, res: Response){
		Logger.error(`Resources not found!`);
		res.status(HttpStatusCode.NOT_FOUND).send(new AppError('Route not found', HttpStatusCode.NOT_FOUND));
}
