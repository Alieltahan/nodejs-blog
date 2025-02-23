import { Response } from "express";
import { validateBlog } from "../models/blogsModel";
import { BlogModelType } from "../models/types";
import BlogService from "../services/blogService";
import Logger from "../services/Logger";
import { blogPayloadType } from "../Types/request";
import AppError from "../utils/AppError";
import { blogsMapper } from "../utils/blogsMapper";
import { HttpStatusCode } from "../utils/constants";

const asyncHandler = require('express-async-handler');

class BlogController {
	getAllBlogs = asyncHandler(async (req: blogPayloadType, res: Response) => {
		try {

		const category= req.query.category?.toString?.().trim?.();
		if (category && typeof category === 'string') {
			const blogs = await BlogService.getBlogsByCategory(category);

			if (blogs.code === HttpStatusCode.NOT_FOUND)
				res.status(HttpStatusCode.NOT_FOUND).send(new AppError('Not blogs found with these search criteria', HttpStatusCode.NOT_FOUND));

			return res.status(HttpStatusCode.OK).send(blogs);
		}

		const { blogs } = await BlogService.getAll();

		const mappedBlogs = blogsMapper(blogs);

		return res.status(HttpStatusCode.OK).send(mappedBlogs);
		} catch (err) {
			Logger.error('Failed during Controller getAllBlogs', err);
			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(new AppError('Something Went wrong', HttpStatusCode.INTERNAL_SERVER_ERROR));
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
		try {

		const blogId = req.params.id;
		const {blog, code} = await BlogService.getBlogById(blogId);

		if (code === HttpStatusCode.NOT_FOUND) return res.status(HttpStatusCode.NOT_FOUND).send(new AppError("Blog not found", HttpStatusCode.NOT_FOUND));

		if (blog?.user?._id !== req?.body?.user?._id) return res.status(HttpStatusCode.FORBIDDEN).send(new AppError("You are not authorized to edit this blog", HttpStatusCode.FORBIDDEN));

		const updatedBlog = {
			title: req.body.title,
			category: req.body.category,
			content: req.body.content,
		}

		const { error } = validateBlog(updatedBlog);
		if (error) return res.status(HttpStatusCode.BAD_REQUEST).send(new AppError(error.details[0].message, HttpStatusCode.BAD_REQUEST));

		await BlogService.updateBlog(updatedBlog)

		return res.status(HttpStatusCode.OK).send({status: "success", description: "Blog updated successfully", statusCode: HttpStatusCode.OK});

		}
		catch (err) {
			res.status(HttpStatusCode.BAD_REQUEST).send(new AppError('Bad Request, failed to update blog', HttpStatusCode.BAD_REQUEST))
		}
	})

	deleteBlog = asyncHandler(async (req: blogPayloadType, res: Response) => {
		try {

		const blogId = req.params.id;
		const {blog, code} = await BlogService.getBlogById(blogId);

		if (code === HttpStatusCode.NOT_FOUND) return res.status(HttpStatusCode.NOT_FOUND).send(new AppError("Blog not found", HttpStatusCode.NOT_FOUND));

		if (blog?.user?._id !== req?.body?.user?._id) return res.status(HttpStatusCode.FORBIDDEN).send(new AppError("You are not authorized to delete this blog", HttpStatusCode.FORBIDDEN));

		await BlogService.deleteBlogById(blogId);

		res.status(HttpStatusCode.OK).send({status: "success", description: "Blog deleted successfully", statusCode: HttpStatusCode.OK});
		}
		catch (err) {
			Logger.error('Service Failed during deleting Blog', err);

			res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).send(new AppError('Something went wrong', HttpStatusCode.INTERNAL_SERVER_ERROR))
		}
	})
}

export default new BlogController();
