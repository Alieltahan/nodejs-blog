import express, { Express } from 'express';
const app: Express = express();
import winston from 'winston';
import config from "config";

require("./startup/logging")();
require("./startup/cors")(app);
require("./startup/helmet")(app);
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/objectIdValidation")();

const port: number = config.get("port") ?? 3000;

const server = app.listen(port, () =>
	winston.info(`⚡️Server Listening on port ${port}...`)
);

module.exports = server;
