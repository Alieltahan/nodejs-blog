import express, { Express } from 'express';
const error = require('../middleware/error');

module.exports = function(app: Express) {
	app.use(express.json());
	app.use('/api/users', require('../routes/usersRoutes'));
	app.use('/api/users/auth', require('../routes/authenticate'));
	app.use(error);
}
