import express, { Express } from 'express';

module.exports = function(app: Express) {
	app.use(express.json());
	app.use('/api/users', require('../routes/usersRoutes'));
	app.use('/api/users/auth', require('../routes/authenticate'));
	app.use('/api/blogs', require('../routes/blogsRoutes'));
	app.use('*', require('../middleware/error'));
}
