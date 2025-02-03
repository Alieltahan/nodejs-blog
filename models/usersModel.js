const config = require("config");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
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

const User = mongoose.model("Users", userSchema);

function validateUser(user) {
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
					 .regex(/^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z0-9!@#$%^&*()_+~`|}{[\]:;?><,./]+$/, `Password must contain at least one letter and one number`) // Allows only alphanumeric characters and special characters
					 .label('Password')
					 .required(),
		confirmPassword: Joi.string()
						.valid(Joi.ref('password'), 'does not match Password') // Ensure passwords match
						.label('Confirm Password')
					 	.required()
	});

	return schema.validate(user);
}

exports.UserModel = User;
exports.validateUser = validateUser;
