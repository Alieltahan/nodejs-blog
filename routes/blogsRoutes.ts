import { Router } from "express";
import BlogController from "../controller/BlogController";
import { authorize } from "../middleware/authorize";
import { validateObjectId } from "../middleware/validateObjectId";

const express = require("express");
const router: Router = express.Router();

router.route('/')
	.get(BlogController.getAllBlogs)
	.post(authorize, BlogController.postBlog)

router.route('/:id')
	.put([authorize, validateObjectId], BlogController.updateBlog)
	.delete([authorize, validateObjectId], BlogController.deleteBlog)

module.exports = router;
