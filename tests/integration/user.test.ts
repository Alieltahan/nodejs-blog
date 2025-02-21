import request from 'supertest';
import { HttpStatusCode } from '../../utils/constants';
const { UserModel } = require('../../models/usersModel');

describe('Register User - /api/users/signup', () => {
	let server;
	beforeEach( async () => server = require('../../index'))
	afterEach(async () => {
		await server.close();
		await UserModel.deleteMany({});
	});

	let newUser: any;

	const exec = () => {
		return request(server)
			.post('/api/users/signup')
			.send(newUser);
	};

	beforeEach(() => {
		newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'password123',
			confirmPassword: 'password123',
		};
	});

	it('should return BAD_REQUEST-400 if user validation fails if email is empty', async () => {
		newUser.email = '';

		const res = await exec();

		expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
	});

	it('should return BAD_REQUEST-400 if user Email is not valid', async () => {
		newUser.email = 'JustInvalidEmail';

		const res = await exec();

		expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
	});

	it('should return BAD_REQUEST-400 if user name is less than 2 characters', async () => {
		newUser.name = 'A';

		const res = await exec();

		expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
	});

	it('should return BAD_REQUEST-400 if confirm password doesnt match', async () => {
		newUser.confirmPassword = 'password';

		const res = await exec();

		expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
		});

	it('should return BAD_REQUEST-400 if password is less than 8 Characters', async () => {
		newUser.password = 'password';
		newUser.confirmPassword = 'password';

		const res = await exec();

		expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
		});

	it('should return BAD_REQUEST-400 if password is only characters', async () => {
		newUser.password = 'justCharacters';
		newUser.confirmPassword = 'justCharacters';

		const res = await exec();

		expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
		});

	it('should return BAD_REQUEST-400 if password is only numbers', async () => {
		newUser.password = '1234567890';
		newUser.confirmPassword = '1234567890';

		const res = await exec();

		expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
		});

	it('should return BAD_REQUEST-400 if user already exists', async () => {
		await exec();

		const res = await exec();

		expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
	});

	it('should return CREATED-201 and the user if registration is successful', async () => {
		const res = await exec();

		expect(res.status).toBe(HttpStatusCode.CREATED);
		expect(res.header).toHaveProperty('x-auth-token');
		expect(res.body).toHaveProperty('name', 'John Doe');
		expect(res.body).toHaveProperty('email', 'john.doe@example.com');
		expect(res.body).not.toHaveProperty('password');
	});
});

describe('Login User - /api/users/auth', () => {
	let server;
	beforeEach(async () => server = require('../../index'))
	afterEach(async () => {
		await server.close();
		await UserModel.deleteMany({});
	});

	let newUser: any;

	const execRegisterUser = () => {
		return request(server)
			.post('/api/users/signup')
			.send(newUser);
	};

	beforeEach(() => {
		newUser = {
			name: 'John Doe',
			email: 'john.doe@example.com',
			password: 'password123',
			confirmPassword: 'password123',
		};
	});

	let userLogging: any;

	const execLogin = () => {
		return request(server)
			.post('/api/users/auth')
			.send(userLogging);
	};

	beforeEach(() => {
		userLogging = {
			email: 'john.doe@example.com',
			password: 'password123',
		};
	});

	it('should return BAD_REQUEST-400 if user validation fails if email is empty', async () => {
		userLogging.email = ''; // empty email

		const res = await execLogin();

		expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
		expect(res.body.isOperational).toBeTruthy();
		expect(res.body.description).toContain('\"email\" is not allowed to be empty');
	});

	it('should return BAD_REQUEST-400 if user validation fails if password is empty', async () => {
		userLogging.password = ''; // empty email

		const res = await execLogin();

		expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
		expect(res.body.isOperational).toBeTruthy();
		expect(res.body.description).toContain('\"password\" is not allowed to be empty');
	});

	it('should return BAD_REQUEST-400 if user validation fails if email does not match', async () => {
		userLogging.email = 'joe@example.com'; // email doesn't match

		const res = await execLogin();

		expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
		expect(res.body.description).toContain('Invalid email or password.');
		expect(res.body.isOperational).toBeTruthy();
	});

	it('should return BAD_REQUEST-400 if user validation fails if password does not match', async () => {
		userLogging.password = 'password'; // password doesn't match

		const res = await execLogin();

		expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
		expect(res.body.description).toContain('Invalid email or password.');
		expect(res.body.isOperational).toBeTruthy();
	});

	it('should return BAD_REQUEST-400 if user does not exist', async () => {
		const res = await execLogin();

		expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
		expect(res.body.description).toContain('Invalid email or password.');
		expect(res.body.isOperational).toBeTruthy();
	});

	it('should return OK-200 and the token if authentication is successful', async () => {
		await execRegisterUser();

		const res = await execLogin();

		expect(res.status).toBe(HttpStatusCode.OK)
	});
});
