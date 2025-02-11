import { Router } from "express";
import BlogController from "../controller/BlogController";
import { authorize } from "../middleware/authorize";
import { validateObjectId } from "../middleware/validateObjectId";

const express = require("express");
const router: Router = express.Router();

router.route('/')
	.get(BlogController.getAllBlogs)
	// @ts-ignore
	.post(authorize, BlogController.postBlog)

router.route('/:id')
	// @ts-ignore
	.put([authorize, validateObjectId], BlogController.updateBlog)

module.exports = router;
