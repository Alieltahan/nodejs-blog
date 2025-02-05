import { Express } from "express";

const cors = require("cors");

module.exports = function(app: Express) {
	app.use(cors());
};
