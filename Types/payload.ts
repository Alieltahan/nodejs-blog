export interface AuthenticatePayload {
	email?: string;
	password?: string;
}

export interface SignUpPayload {
	email: string;
	name: string;
	password: string;
	confirmPassword: string;
}
