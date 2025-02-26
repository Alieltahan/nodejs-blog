import { BlogModelType } from "../models/types";

export function blogsMapper (blogs: BlogModelType[], filteredBy?: string) {
	const mappedBlogs= blogs?.map((blog: BlogModelType) => ({
		_id: blog._id,
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

	return {
		blogs: mappedBlogs,
		filteredBy: filteredBy
	}
}
