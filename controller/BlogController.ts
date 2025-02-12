import { Response } from "express";
import BlogService from "../services/blogService";
import { blogPayloadType } from "../Types/request";
import { validateBlog } from "../models/blogsModel";
import AppError from "../utils/AppError";
import { HttpStatusCode } from "../utils/constants";

const asyncHandler = require('express-async-handler');

class BlogController {
	getAllBlogs = asyncHandler(async (req: blogPayloadType, res: Response) => {
		const category= req.query.category.toString().trim();
		if (category && typeof category === 'string') {
			const blogs = await BlogService.getBlogsByCategory(category);
			return res.status(HttpStatusCode.OK).send(blogs);
		} else {
		const blogs = await BlogService.getAll();
		return res.status(HttpStatusCode.OK).send(blogs);
		}
	})

	postBlog = asyncHandler(async (req: blogPayloadType, res: Response) => {
		const { error } = validateBlog(req.body);
		if (error) return res.status(HttpStatusCode.BAD_REQUEST).send(new AppError(error.details[0].message, HttpStatusCode.BAD_REQUEST));
		const newBlog = {
			title: req.body.title,
			category: req.body.category,
			content: req.body.content,
			user: {
				_id: req.body.user._id,
				email: req.body.user.email,
				name: req.body.user.name
			}
		}
		let blog = await BlogService.createBlog(newBlog);

		return res.status(HttpStatusCode.CREATED).send(blog);
	})

	updateBlog = asyncHandler(async (req: blogPayloadType, res: Response) => {
		const blogId = req.params.id;
		const blog = await BlogService.getBlogById(blogId);
		if (!blog) return res.status(HttpStatusCode.NOT_FOUND).send(new AppError("Blog not found", HttpStatusCode.NOT_FOUND));

		if (blog.user._id !== req.body.user._id) return res.status(HttpStatusCode.FORBIDDEN).send(new AppError("You are not authorized to update this blog", HttpStatusCode.FORBIDDEN));

		const { error } = validateBlog({
			title: req.body.title,
			category: req.body.category,
			content: req.body.content,
		});
		if (error) return res.status(HttpStatusCode.BAD_REQUEST).send(new AppError(error.details[0].message, HttpStatusCode.BAD_REQUEST));

		await blog.set({
			title: req.body.title,
			category: req.body.category,
			content: req.body.content,
			updatedAt: new Date(),
		})

		await blog.save();

		return res.status(HttpStatusCode.OK).send({status: "success", description: "Blog updated successfully", statusCode: HttpStatusCode.OK});
	})

	deleteBlog = asyncHandler(async (req: blogPayloadType, res: Response) => {
		const blogId = req.params.id;
		const blog = await BlogService.getBlogById(blogId);
		if (!blog) return res.status(HttpStatusCode.NOT_FOUND).send(new AppError("Blog not found", HttpStatusCode.NOT_FOUND));

		if (blog.user._id !== req.body.user._id) return res.status(HttpStatusCode.FORBIDDEN).send(new AppError("You are not authorized to delete this blog", HttpStatusCode.FORBIDDEN));

		await BlogService.deleteBlogById(blogId);

		res.status(HttpStatusCode.OK).send({status: "success", description: "Blog deleted successfully", statusCode: HttpStatusCode.OK});
	})
}

export default new BlogController();
