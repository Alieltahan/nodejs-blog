import { UserModelType } from "../models/types";
import { AuthenticatePayload, SignUpPayload } from "../Types/payload";
const { UserModel } = require("../models/usersModel");

class UserService {
	async getUserByEmail(email: string): Promise<AuthenticatePayload> {
		return UserModel.findOne({email})
	}

	async createUser(user: SignUpPayload): Promise<UserModelType> {
		return UserModel.create(user);
	}
}

export default new UserService();
