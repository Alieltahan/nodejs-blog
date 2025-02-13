import { NextFunction, Request, Response } from "express";
import AppError from "../utils/AppError";
import { HttpStatusCode } from "../utils/constants";

const mongoose = require('mongoose');

export function validateObjectId(req: Request, res: Response, next: NextFunction) {
	if (!mongoose.Types.ObjectId.isValid(req.params.id))
		return res.status(404).send(new AppError("Invalid ID", HttpStatusCode.NOT_FOUND));

	next();
}
