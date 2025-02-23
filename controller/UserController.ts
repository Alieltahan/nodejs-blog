import { Response } from "express";
import asyncHandler from "express-async-handler";
import UserServices from "../services/userServices";
const { validateUserLogin } = require("../models/usersModel");
import { signUpPayloadType } from "../Types/request";
import AppError from "../utils/AppError";
import { HttpStatusCode } from "../utils/constants";
const bcrypt = require('bcrypt');

const { validateUserSignUp } = require("../models/usersModel");
import UserService from "../services/userServices";

class UserController {
	// @ts-ignore
	registerUser = asyncHandler(async (req: signUpPayloadType, res: Response) => {
		try {

		const newUser = {
			name: req.body.name,
			email: req.body.email,
			password: req.body.password,
			confirmPassword: req.body.confirmPassword,
		}
		const {error} = validateUserSignUp(newUser);
		if (error) return res.status(HttpStatusCode.BAD_REQUEST).send(new AppError(error.details[0].message, HttpStatusCode.BAD_REQUEST));

		const {token, code, user} = await UserService.createUser(newUser);

		if(code === HttpStatusCode.BAD_REQUEST) {
			return res.status(HttpStatusCode.BAD_REQUEST).send(new AppError("User already exists!", HttpStatusCode.BAD_REQUEST));
		}

		return res
			.status(HttpStatusCode.CREATED)
			.header("x-auth-token", token)
			.header("access-control-expose-headers", "x-auth-token")
			.send({
				"_id": user?._id,
				"name": user?.name,
				"email": user?.email,
			});
		}
		catch (error) {
			return res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(new AppError(error.message, HttpStatusCode.INTERNAL_SERVER_ERROR));
		}
	});

	// @ts-ignore
	authenticateUser = asyncHandler(async (req: signUpPayloadType, res: Response): Promise<Response<any, Record<string, any>>> => {
		try {
			const {error} = validateUserLogin(req.body);
			if (error) return res.status(HttpStatusCode.BAD_REQUEST).send(new AppError(error.details[0].message, HttpStatusCode.BAD_REQUEST));

			let { user, code } = await UserServices.getUserByEmail(req.body.email)

			if (code === HttpStatusCode.NOT_FOUND) return res.status(HttpStatusCode.BAD_REQUEST).send(new AppError('Invalid email or password.', HttpStatusCode.BAD_REQUEST));

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
	} )
}

export default new UserController();
