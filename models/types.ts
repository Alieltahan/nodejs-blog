import { AuthenticatePayload, BlogPayload } from "../Types/payload";

export interface BlogModelType {
	title: string;
	content: string;
	category: string;
	createdAt?: Date,
	updatedAt?: Date,
	user?: AuthenticatePayload;
	save?: () => Promise<void>
	set?: (blog: BlogPayload) => Promise<void>
	remove?: () => Promise<void>
}

export interface UserModelType	{
	name: string,
	email: string,
	password: string,
	confirmPassword: string,
	createdAt?: Date,
	generateAuthToken?: () => string,
	save?: () => Promise<void>
}
