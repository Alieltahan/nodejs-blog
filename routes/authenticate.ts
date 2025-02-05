import { Router } from "express";
import express from "express";
import { authenticateUserHandler } from "../services/authenticateService";
const router: Router = express.Router();

router.route('/')
	// @ts-ignore
	  .post(authenticateUserHandler());

module.exports = router;
