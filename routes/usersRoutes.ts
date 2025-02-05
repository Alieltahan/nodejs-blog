import { registerUser } from "../services/userServices";

const express = require("express");
const router = express.Router();

router.route('/signup')
		.post(registerUser())

module.exports = router;
