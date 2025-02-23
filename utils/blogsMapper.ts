import { BlogModelType } from "../models/types";

export function blogsMapper (blogs: BlogModelType[]) {
	return blogs?.map((blog: BlogModelType) => ({
		title: blog.title,
		category: blog.category,
		content: blog.content,
		createdAt: blog.createdAt,
		updatedAt: blog.updatedAt,
		user: {
			name: blog.user.name,
			_id: blog.user._id
		}
	}));
}
