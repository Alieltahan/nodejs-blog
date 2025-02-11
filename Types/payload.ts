export interface AuthenticatePayload {
	_id?: string;
	email: string;
	password: string;
}

export interface SignUpPayload {
	email: string;
	name: string;
	password: string;
	confirmPassword: string;
}

export interface UserObject {
	user: Omit<AuthenticatePayload, 'password'>
}

export interface BlogPayload {
	title: string;
	content: string;
	category: string;
	user: AuthenticatePayload
}
