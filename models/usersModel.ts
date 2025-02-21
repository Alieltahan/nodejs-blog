import { ValidationResult } from "joi";
import { Schema } from "mongoose";
import { authenticatePayloadType } from "../Types/request";
import { regexPass } from "../utils/constants";
import { UserModelType } from "./types";

const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema: Schema<UserModelType> = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		minlength: 2,
		maxlength: 50
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		unique: true,
		lowercase: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 8,
		maxlength: 1024
	},
	createdAt: {
		type: Date,
		default: Date.now,
	}
});

userSchema.methods.generateAuthToken = function() {
	const token = jwt.sign(
		{
			_id: this._id,
			name: this.name,
			email: this.email,
		},
		config.get("jwtPrivateKey")
	);
	return token;
};

const UserModel: Schema<UserModelType> = mongoose.model("Users", userSchema);

function validateUserSignUp(user: UserModelType): ValidationResult {
	const schema = Joi.object({
		name: Joi.string()
				 .min(2)
				 .max(50)
				 .label('Name')
				 .required(),
		email: Joi.string()
				  .min(5)
				  .max(255)
				  .required()
				  .email()
				  .label('Email'),
		password: Joi.string()
					 .min(8)
					 .max(255)
					 .regex(regexPass, `Password must contain at least one letter and one number`) // Allows only alphanumeric characters and special characters
					 .label('Password')
					 .required(),
		confirmPassword: Joi.string()
						.valid(Joi.ref('password'), 'does not match Password') // Ensure passwords match
						.label('Confirm Password')
					 	.required()
	});

	return schema.validate(user);
}

function validateUserLogin(req: authenticatePayloadType): ValidationResult {
	const schema = Joi.object({
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(8).max(255).required(),
	});

	return schema.validate(req);
}

exports.UserModel = UserModel;
exports.validateUserLogin = validateUserLogin;
exports.validateUserSignUp = validateUserSignUp;
