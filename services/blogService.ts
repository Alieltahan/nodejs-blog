import { BlogModel } from "../models/blogsModel";
import { BlogModelType } from "../models/types";
import { AuthenticatePayload, BlogPayload } from "../Types/payload";
import { blogPayloadType } from "../Types/request";
import AppError from "../utils/AppError";
import { HttpStatusCode } from "../utils/constants";
import Logger from "./Logger";

const APIFeatures = require('../utils/APIFeatures');

interface BlogServiceTypes {
	code: HttpStatusCode,
	blogs?: BlogModelType[],
	blog?: BlogModelType,
	save?: () => Promise<void>
	set?: (blog: BlogPayload) => Promise<void>
	remove?: () => Promise<void>;
	user?: AuthenticatePayload;
	totalBlogs?: number;
	totalPages?: number;
}

class BlogService {
	async getAll (req: blogPayloadType): Promise<BlogServiceTypes> {
		try {
			const { limit } = req.query;
			if ( limit ) {
				const features = new APIFeatures(BlogModel, req.query).paginate();
				const result = await features.query;

				const blogs = result[0]?.data ?? features;
				const totalBlogs = result[0].totalCount[0]?.count || 0;
				const totalPages = Math.ceil(totalBlogs / +req.query?.limit);
				return {
					code: HttpStatusCode.OK,
					blogs,
					totalBlogs,
					totalPages
				}
			} else {
				const blogs = await BlogModel.find();

				return {
					code: HttpStatusCode.OK,
					blogs,
					totalBlogs: blogs?.length,
					totalPages: undefined,
				}
			}

		} catch(err) {
			Logger.error(`BlogService() => getAll() error : ${err}`);
			new AppError('Internal Server error', HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	async createBlog (blog: BlogModelType): Promise<BlogServiceTypes> {
		try {
			const newBlog = {
				title: blog.title,
				content: blog.content,
				category: blog.category,
				user: {
					name: blog.user.name,
					_id: blog.user._id,
					email: blog.user.email
				}
			}
			await new BlogModel(newBlog).save();

			return {
				code: HttpStatusCode.CREATED
			}
		} catch(err) {
			Logger.error(`BlogService() => createBlog() error : ${err}`);
			new AppError('Internal Server error', HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	async getBlogsByCategory (category: string): Promise<BlogServiceTypes> {
		try {
			const blogs = await BlogModel.find({category: { $regex : category, $options: 'i' }}).select('-__v');
			if (blogs.length === 0) {
				return {
					code: HttpStatusCode.NOT_FOUND
				}
			}

			return {
				code: HttpStatusCode.OK,
				blogs
			}
		} catch(err) {
			Logger.error(`BlogService() => getBlogsByCategory() error : ${err}`);
			new AppError('Internal Server error', HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	async getBlogById(id: string): Promise<BlogServiceTypes> {
		try {
			const blog = await BlogModel.findById(id).select('-__v');
			if (!blog) {
				return {
					code: HttpStatusCode.NOT_FOUND
				}
			}
			return {
				code: HttpStatusCode.OK,
				blog
			}
		}
		catch (err) {
			Logger.error(`BlogService() => getBlogById() error : ${err}`);
			new AppError('Internal Server error', HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	async updateBlog(updatedBlog: BlogModelType): Promise<BlogServiceTypes> {
		try {

			await BlogModel.updateOne(updatedBlog)

			return {
				code: HttpStatusCode.OK
			}
		} catch (err) {
			Logger.error(`BlogService() => updateBlog() error : ${err}`);
			new AppError('Internal Server error', HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	async deleteBlogById (id: string): Promise<BlogPayload| void> {
		try {
			return BlogModel.findByIdAndDelete(id);
		}
		catch (err) {
			Logger.error(`BlogService() => deleteBlogById() error : ${err}`);
			new AppError('Internal Server error', HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}

export default new BlogService();
