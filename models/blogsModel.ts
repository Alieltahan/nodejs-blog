import { ValidationResult } from "joi";
import { Schema } from "mongoose";
import { BlogModelType } from "./types";

const Joi = require("joi");
const mongoose = require("mongoose");


const blogSchema: Schema<BlogModelType> = new mongoose.Schema({
	title: {
		type: String,
		minlength: 2,
		maxlength: 70,
		required: true,
	},
	content: {
		type: String,
		required: true,
		minlength: 5,
	},
	category: {
		type: String,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	},
	user: {
		_id: String,
		email: String,
		name: String,
	}
});

const BlogModel = mongoose.model("Blogs", blogSchema);

function validateBlog(blog: BlogModelType): ValidationResult {
	const schema = Joi.object({
		title: Joi.string()
					.min(2)
					.max(70)
					.label('Title')
					.required(),
		content: Joi.string()
					.min(5)
					.max(500)
					.trim()
					.required()
					.label('Content'),
		category: Joi.string()
					 .min(3)
					 .max(20)
					 .trim()
					 .label('Category'),
		user: {
			_id: Joi.string().required().label('User is not correct'),
			email: Joi.string().email().label('User Email is required'),
			name: Joi.string().label('User name is missing')
		}
	});

	return schema.validate(blog);
}

export {
	validateBlog,
	BlogModel,
}
