const bcrypt = require("bcrypt");
const express = require("express");
const router = express.Router();
const { UserModel, validateUser } = require("../models/usersModel");
const AppError = require('../utils/AppError');

router.route('/')
		.post( async (req, res) => {
			const { error } = validateUser(req.body);
			if (error) return res.status(400).send(new AppError(error.details[0].message, 400));

			const { name, email, password } = req.body;
			let user = await UserModel.findOne({ email });

			if (user) return res.status(400).send(new AppError("User already exists!", 400));

			user = new UserModel({ name, email, password });
			const salt = await bcrypt.genSalt(10);
			user.password = await bcrypt.hash(user.password, salt);
			await user.save();

			const token = user.generateAuthToken();
			res
				.header("x-auth-token", token)
				.header("access-control-expose-headers", "x-auth-token")
				.send({
					"_id": user._id,
					"name": name,
					"email": email,
				});
		})

module.exports = router;
