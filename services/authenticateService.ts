import { Response } from "express";
import { UserModelType } from "../models/types";
const { UserModel, validateUserLogin } = require("../models/usersModel");
import { signUpPayloadType } from "../Types/request";
import AppError from "../utils/AppError";
import { HttpStatusCode } from "../utils/constants";
const bcrypt = require('bcrypt');


export function authenticateUserHandler() {
	return async (req: signUpPayloadType, res: Response): Promise<Response<any, Record<string, any>>> => {
		try {
			const {error} = validateUserLogin(req.body);
			if (error) return res.status(HttpStatusCode.BAD_REQUEST).send(new AppError(error.details[0].message, HttpStatusCode.BAD_REQUEST));

			let user: UserModelType = await UserModel.findOne({email: req.body.email});
			if (!user) return res.status(HttpStatusCode.BAD_REQUEST).send(new AppError('Invalid email or password.', HttpStatusCode.BAD_REQUEST));

			const validPassword: boolean = await bcrypt.compare(req.body.password, user.password);
			if (!validPassword) return res.status(HttpStatusCode.BAD_REQUEST).send(new AppError('Invalid email or password.', HttpStatusCode.BAD_REQUEST));

			const token: string = user.generateAuthToken();
			res
				.status(HttpStatusCode.OK)
				.send(token);
		}
		catch (error) {
			return res.send(HttpStatusCode.INTERNAL_SERVER_ERROR).send(new AppError(error.details[0].message, HttpStatusCode.INTERNAL_SERVER_ERROR));
		}
	}
}
