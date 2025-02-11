import { Router } from "express";
import BlogController from "../controller/BlogController";
import { authorize } from "../middleware/authorize";

const express = require("express");
const router: Router = express.Router();

router.route('/')
	.get(BlogController.getAllBlogs)
	// @ts-ignore
	.post(authorize, BlogController.postBlog)

module.exports = router;
