import { Response } from "express";
import asyncHandler from "express-async-handler";
import { AuthenticatePayload } from "../Types/payload";
import { UserModelType } from "../models/types";
import { signUpPayloadType } from "../Types/request";
import AppError from "../utils/AppError";
import { HttpStatusCode } from "../utils/constants";
const { validateUserSignUp } = require("../models/usersModel");
const bcrypt = require("bcrypt");
import UserService from "../services/userServices";

class UserController {
	// @ts-ignore
	registerUser = asyncHandler(async (req: signUpPayloadType, res: Response) => {
		const {error} = validateUserSignUp(req.body);
		if (error) return res.status(HttpStatusCode.BAD_REQUEST).send(new AppError(error.details[0].message, HttpStatusCode.BAD_REQUEST));

		const {name, email, password} = req.body;
		let user: AuthenticatePayload | UserModelType = await UserService.getUserByEmail(email);

		if (user) return res.status(HttpStatusCode.BAD_REQUEST).send(new AppError("User already exists!", HttpStatusCode.BAD_REQUEST));

		user = await UserService.createUser(req.body);

		const salt: string = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		if ("save" in user) {
			await user.save();
		}

		let token = "";
		if ("generateAuthToken" in user) {
			token = user.generateAuthToken();
		}
		return res
			.header("x-auth-token", token)
			.header("access-control-expose-headers", "x-auth-token")
			.send({
				"_id": "_id" in user ? user?._id : "",
				"name": name,
				"email": email,
			});
		});
}

export default new UserController();
