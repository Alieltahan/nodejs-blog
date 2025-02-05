import { ValidationResult } from "joi";
import { Schema } from "mongoose";
import { BlogModelType } from "./types";

const Joi = require("joi");
const mongoose = require("mongoose");


const userSchema: Schema<BlogModelType> = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 70
	},
	content: {
		type: String,
		required: true,
		minlength: 5,
	},
	category: {
		type: String,
		minLength: 3,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
	updatedAt: {
		type: Date,
		default: Date.now,
	}
});

const Blog = mongoose.model("Blogs", userSchema);

function validateBlog(blog: BlogModelType): ValidationResult {
	const schema = Joi.object({
		title: Joi.string()
					.min(2)
					.max(70)
					.label('Title')
					.required(),
		content: Joi.string()
					.min(5)
					.trim()
					.required()
					.label('Content'),
		category: Joi.string()
					 .min(3)
					 .trim()
					 .label('Category')
					 .required(),
	});

	return schema.validate(blog);
}

exports.blogModel = Blog;
exports.validateBlog = validateBlog;
