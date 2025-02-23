import UserController from "../controller/UserController";

const express = require("express");
const router = express.Router();

router.route('/signup')
		.post(UserController.registerUser);

router.route('/auth')
		.post(UserController.authenticateUser);

module.exports = router;
