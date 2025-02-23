import express, { Express } from 'express';
const error = require('../middleware/error');
const cors = require("cors");

module.exports = function(app: Express) {
	app
		.use(express.json())
		.use(cors())
		.use('/api/users', require('../routes/usersRoutes'))
		.use('/api/blogs', require('../routes/blogsRoutes'))
		.use(error);
}
