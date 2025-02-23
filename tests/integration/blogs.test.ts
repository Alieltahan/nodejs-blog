import { HttpStatusCode } from "../../utils/constants";

const request = require('supertest');
const { UserModel } = require('../../models/usersModel');
const { BlogModel } = require('../../models/blogsModel');

describe('Create Blog POST /api/blogs', () => {
	let server;
	beforeEach( async () => server = require('../../index'))
	afterEach(async () => {
		await BlogModel.deleteMany({});
		await server.close();
	});

	let token: string;

	const exec = () => {
		return request(server)
			.post('/api/blogs')
			.set('x-auth-token', token)
			.send({ title: 'New Blog', content: 'This is a new blog', category: 'Tech' });
	}

	beforeEach(() => {
		token = new UserModel().generateAuthToken();
	});

	it('should return UNAUTHORIZED-401 if no token is provided', async () => {
		token = '';

		const res = await exec();

		expect(res.status).toBe(HttpStatusCode.UNAUTHORIZED);
	});

	it('should return BAD_REQUEST-400 if token is invalid', async () => {
		token = 'a';

		const res = await exec();

		expect(res.status).toBe(HttpStatusCode.BAD_REQUEST);
	});

	it('should return CREATED-201 if token is valid', async () => {
		const res = await exec();

		expect(res.status).toBe(HttpStatusCode.CREATED);
	});
});
