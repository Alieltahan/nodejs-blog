import { Response } from "express";
import { SignUpPayloadType } from "../Types/request";
import AppError from "../utils/AppError";
import { httpStatusCode } from "../utils/constants";
const { UserModel, validateUserSignUp } = require("../models/usersModel");
const bcrypt = require("bcrypt");

export function registerUser() {
	return async (req: SignUpPayloadType, res: Response): Promise<Response<any, Record<string, any>>> => {
		try {
			const {error} = validateUserSignUp(req.body);
			if (error) return res.status(httpStatusCode.BAD_REQUEST).send(new AppError(error.details[0].message, httpStatusCode.BAD_REQUEST));

			const {name, email, password} = req.body;
			let user = await UserModel.findOne({email});

			if (user) return res.status(httpStatusCode.BAD_REQUEST).send(new AppError("User already exists!", httpStatusCode.BAD_REQUEST));

			user = new UserModel({name, email, password});
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(user.password, salt);
			await user.save();

			const token = user.generateAuthToken();
			res
				.header("x-auth-token", token)
				.header("access-control-expose-headers", "x-auth-token")
				.send({
					"_id": user._id,
					"name": name,
					"email": email,
				});
		} catch (error) {
			return res.status(httpStatusCode.INTERNAL_SERVER_ERROR).send(new AppError(error.details[0].message, httpStatusCode.INTERNAL_SERVER_ERROR));
		}
	}
}
