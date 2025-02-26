import express, { Express } from 'express';
import AppError from "../utils/AppError";
import { HttpStatusCode } from "../utils/constants";
const swaggerUi = require('swagger-ui-express');
const error = require('../middleware/error');
const cors = require("cors");
const YAML = require('yamljs');
const swaggerDoc = YAML.load('./startup/swagger.yaml')

module.exports = function(app: Express) {
	if (process.env.NODE_ENV === 'development') {
	app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
	}
	app
		.use(express.json())
		.use(cors())
		.use('/api/users', require('../routes/usersRoutes'))
		.use('/api/blogs', require('../routes/blogsRoutes'))
		.use('*', require('../routes/nonExistRoute'))
		.use(error);

}
