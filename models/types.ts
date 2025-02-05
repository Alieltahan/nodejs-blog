export interface BlogModelType {
	title: string;
	content: string;
	category: string;
}

export interface UserModelType	{
	name: string,
	email: string,
	password: string,
	confirmPassword: string,
	createdAt: Date,
	generateAuthToken: () => string,
}
