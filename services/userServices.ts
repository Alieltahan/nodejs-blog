import { UserModelType } from "../models/types";
import { AuthenticatePayload, SignUpPayload } from "../Types/payload";
import AppError from "../utils/AppError";
import { HttpStatusCode } from "../utils/constants";
const { UserModel } = require("../models/usersModel");
const bcrypt = require("bcrypt");

class UserService {
	async getUserByEmail(email: string): Promise<AuthenticatePayload> {
		return UserModel.findOne({email});
	}

	async createUser(user: SignUpPayload): Promise<{
		token: string;
		code: number;
		user: AuthenticatePayload
	}> {
			const { name, email, password } = user;
			const userExist = await this.getUserByEmail(email);
			if (userExist) {
				return {
					token: "",
					code: HttpStatusCode.BAD_REQUEST,
					user: userExist
				}
			} else {
				const newUser = await UserModel.create({
					name,
					email,
					password,
				});

				const salt: string = await bcrypt.genSalt(10);
				newUser.password = await bcrypt.hash(user.password, salt);
				if( 'save' in newUser) {
					await newUser.save();
				}
				const token = newUser.generateAuthToken();
				return {
					code : HttpStatusCode.CREATED,
					user: newUser,
					token
				}
			}
		}
}

export default new UserService();
