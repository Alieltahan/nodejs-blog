import { NextFunction, Request, Response } from "express";

const mongoose = require('mongoose');

module.exports = function(req: Request, res: Response, next: NextFunction) {
	if (!mongoose.Types.ObjectId.isValid(req.params.id))
		return res.status(404).send('Invalid ID.');

	next();
}
