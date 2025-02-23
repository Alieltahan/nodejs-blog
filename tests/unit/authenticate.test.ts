const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');
const { UserModel } = require('../../models/usersModel');

describe('user.generateAuthToken', () => {
	it('should create token and decode it correctly with correct payload', async () => {
		const payload = {
			_id: new mongoose.Types.ObjectId().toHexString(),
			name: 'Abc',
			email: 'user@domain.com',
		};
		const user = await UserModel(payload);
		const token = user?.generateAuthToken?.();
		const decoded = jwt.verify(token, config.get('JWT_PRIVATE_KEY'));
		expect(decoded).toMatchObject(payload);
	});

	it('should not match payload if password is added to the object', async () => {
		const payload = {
			_id: new mongoose.Types.ObjectId().toHexString(),
			name: 'Abc',
			email: 'user@domain.com',
			password: 'Some password',
		};
		const user = await UserModel(payload);
		const token = user?.generateAuthToken?.();
		const decoded = jwt.verify(token, config.get('JWT_PRIVATE_KEY'));
		expect(decoded).not.toMatchObject(payload);
	});
});
