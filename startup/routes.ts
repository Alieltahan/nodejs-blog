import express, { Express } from 'express';
import path from "path";
const swaggerUi = require('swagger-ui-express');
const error = require('../middleware/error');
const cors = require("cors");
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./startup/swagger.yaml')

module.exports = function(app: Express) {
	app
		.use(express.static(path.join(__dirname, 'public')))
		.use(express.json())
		.use(cors())
		.use('/api/users', require('../routes/usersRoutes'))
		.use('/api/blogs', require('../routes/blogsRoutes'))
		.use(error);
	if (process.env.NODE_ENV === 'development') {
		app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
	}
}
