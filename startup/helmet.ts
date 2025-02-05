import { Express } from "express";

const helmet = require("helmet");

module.exports = function(app: Express) {
	app.use(helmet({
		contentSecurityPolicy: false,
		xDownloadOptions: false,
	}));
};
