import { NextFunction, Response } from "express";
import Logger from "../services/Logger";
import { userObjectPayload } from "../Types/request";
import AppError from "../utils/AppError";
import { HttpStatusCode } from "../utils/constants";

const jwt = require("jsonwebtoken");
const config = require("config");

export function authorize (req: userObjectPayload, res: Response, next: NextFunction) {
	if (!config.get("requiresAuth")) return next();

	const token = req.header("x-auth-token");
	if (!token) return res.status(HttpStatusCode.UNAUTHORIZED).send(new AppError("Access denied. No token provided.", HttpStatusCode.UNAUTHORIZED));

	try {
		// Ensure req.body is defined
		if (!req.body) {
			req.body = {};
		}

		const { _id, name, email } = jwt.verify(token, config.get("JWT_PRIVATE_KEY"));

		req.body.user = {
			_id,
			email,
			name
		};
		next();
	} catch (ex) {
		Logger.error('Failed during Middleware Authorization', ex)
		res.status(HttpStatusCode.BAD_REQUEST).send(new AppError("Authorization failed.", HttpStatusCode.BAD_REQUEST));
	}
}
