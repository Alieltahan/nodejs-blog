import UserController from "../controller/UserController";

const express = require("express");
const router = express.Router();

router.route('/signup')
		.post(UserController.registerUser);

module.exports = router;
