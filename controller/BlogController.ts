import { Response } from "express";
import BlogService from "../services/blogService";
import { blogPayloadType } from "../Types/request";
import { validateBlog } from "../models/blogsModel";
import AppError from "../utils/AppError";
import { HttpStatusCode } from "../utils/constants";

const asyncHandler = require('express-async-handler');

class BlogController {
	getAllBlogs = asyncHandler(async (_req: blogPayloadType, res: Response) => {
		const blogs = await BlogService.getAll();
		return res.status(HttpStatusCode.OK).send(blogs);
	})

	postBlog = asyncHandler(async (req: blogPayloadType, res: Response) => {
		const { error } = validateBlog(req.body);
		if (error) return res.status(HttpStatusCode.BAD_REQUEST).send(new AppError(error.details[0].message, HttpStatusCode.BAD_REQUEST));
		let blog = await BlogService.createBlog({...req.body, owner: { _id: req.body.user._id, email: req.body.user.email, name: req.body.user.name }});

		return res.status(HttpStatusCode.CREATED).send(blog);
	})
}

export default new BlogController();
