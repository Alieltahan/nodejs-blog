import { AuthenticatePayload, SignUpPayload } from "../Types/payload";
import { HttpStatusCode } from "../utils/constants";
const { UserModel } = require("../models/usersModel");
const bcrypt = require("bcrypt");

interface GetUserByEmailReturnType {
	code: HttpStatusCode,
	user?: AuthenticatePayload
}

class UserService {
	async getUserByEmail(email: string): Promise<GetUserByEmailReturnType> {
		const user = await UserModel.findOne({email});
		if (!user)
			return {
				code: HttpStatusCode.NOT_FOUND,
				user: undefined
			}

		return {
			code: HttpStatusCode.OK,
			user
		}
	}

	async createUser(user: SignUpPayload): Promise<{
		token: string;
		code: number;
		user: AuthenticatePayload
	}> {
			const { name, email, password } = user;

			const {user: userExist } = await this.getUserByEmail(email);
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

				const mappedUser = {
					_id: newUser._id,
					name: newUser.name,
					email: newUser.email,
				}

				return {
					code : HttpStatusCode.CREATED,
					user: mappedUser,
					token
				}
			}
		}
}

export default new UserService();
