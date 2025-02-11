import { BlogPayload } from "../Types/payload";
import { BlogModel } from "../models/blogsModel";
import { BlogModelType } from "../models/types";
import AppError from "../utils/AppError";
import { HttpStatusCode } from "../utils/constants";
import Logger from "./Logger";

class BlogService {
	async getAll (): Promise<BlogModelType[]| void> {
		try {
			return BlogModel.find().select('-__v');
		} catch(err) {
			Logger.error(`BlogService() => getAll() error : ${err}`);
			new AppError(err.message, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	async createBlog (blog: BlogModelType): Promise<BlogModelType| void> {
		try {
			return await new BlogModel(blog).save();
		} catch(err) {
			Logger.error(`BlogService() => createBlog() error : ${err}`);
			new AppError(err.message, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}

	async getBlogsByCategory (category: string): Promise<BlogModelType[]| void> {
		try {
			return BlogModel.find({category: { $regex : category, $options: 'i' }}).select('-__v');
		} catch(err) {
			Logger.error(`BlogService() => getBlogsByCategory() error : ${err}`);
			new AppError(err.message, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
	async getBlogById (id: string): Promise<BlogPayload| void> {
		try {
			return BlogModel.findById(id).select('-__v');
		}
		catch (err) {
			Logger.error(`BlogService() => getBlogById() error : ${err}`);
			new AppError(err.message, HttpStatusCode.INTERNAL_SERVER_ERROR)
		}
	}
}

export default new BlogService();
