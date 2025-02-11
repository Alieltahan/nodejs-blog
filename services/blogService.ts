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
}

export default new BlogService();
