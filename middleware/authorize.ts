import { NextFunction, Response } from "express";
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
		const { _id, name, email } = jwt.verify(token, config.get("jwtPrivateKey"));
		req.body.user = {
			_id,
			email,
			name
		};
		next();
	} catch (ex) {
		res.status(HttpStatusCode.BAD_REQUEST).send(new AppError("Invalid token.", HttpStatusCode.BAD_REQUEST));
	}
}
