//External Modules
const Joi = require("joi");
const userModel = require("../user/user.model");

//verify-credentials validation schema
const verifyCredentialSchema = Joi.object({
	type: Joi.string().valid("email", "mobile").required().messages({
		"any.only": "Type must be either email or mobile",
		"string.empty": "Type is required",
	}),
	credential: Joi.alternatives()
		.conditional("type", [
			{
				is: "email",
				then: Joi.string()
					.email({ tlds: { allow: false } })
					.required(),
			},
			{
				is: "mobile",
				then: Joi.string()
					.pattern(/^\d{10}$/)
					.required()
					.messages({
						"string.pattern.base": "Mobile must be 10 digits",
					}),
			},
		])
		.required(),
});

//verify-otp-register validation schema
const verifyOtpRegisterSchema = Joi.object({
	type: Joi.string().valid("email", "mobile").required().messages({
		"any.only": "Type must be either email or mobile",
		"string.empty": "Type is required",
	}),
	credential: Joi.alternatives()
		.conditional("type", [
			{
				is: "email",
				then: Joi.string()
					.email({ tlds: { allow: false } })
					.required()
					.messages({
						"string.email": "Invalid email format",
						"string.email": "Email is required",
					}),
			},
			{
				is: "mobile",
				then: Joi.string()
					.pattern(/^\d{10}$/)
					.required()
					.messages({
						"string.pattern.base": "Mobile must be 10 digits",
						"string.empty": "Mobile number is required",
					}),
			},
		])
		.required(),
	otp: Joi.string()
		.pattern(/^\d{6}$/)
		.required()
		.messages({
			"string.pattern.base": "Invalid otp",
		}),
});

//register
const registrationSchema = Joi.object({
	profilePicture: Joi.string().optional().allow(null),
	firstName: Joi.string().min(2).max(30).required().messages({
		"string.empty": "First Name is required",
		"string.min": "First Name should be at least 2 characters long",
		"string.max": "First Name must not exceed 25 characters",
	}),
	lastName: Joi.string().min(2).max(25).required().messages({
		"string.empty": "Last Name is required",
		"string.min": "Last Name should be at least 2 characters long",
		"string.max": "Last Name must not exceed 25 characters",
	}),
	type: Joi.string().valid("email", "mobile").required(),
	email: Joi.string()
		.email()
		.when("type", {
			is: "email",
			then: Joi.required(),
			otherwise: Joi.optional().allow(null),
		}),
	mobile: Joi.string()
		.pattern(/^[0-9]{10}$/)
		.when("type", {
			is: "mobile",
			then: Joi.required(),
			otherwise: Joi.optional().allow(null),
		})
		.allow(null),
	otp: Joi.string().min(6).max(6).required().messages({
		"string.empty": "Please try to register again session is expired",
	}),
	password: Joi.string()
		.pattern(
			new RegExp(
				"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
			)
		)
		.required()
		.messages({
			"string.pattern.base":
				"Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
			"string.empty": "Password cannot be empty.",
			"any.required": "Password is required.",
		}),
});

//login
const loginSchema = Joi.object({
	type: Joi.string().valid("email", "mobile").required().messages({
		"any.only": "Type must be either email or mobile",
		"string.empty": "Type is required",
	}),
	credential: Joi.alternatives()
		.conditional("type", [
			{
				is: "email",
				then: Joi.string()
					.email({ tlds: { allow: false } })
					.required(),
			},
			{
				is: "mobile",
				then: Joi.string()
					.pattern(/^\d{10}$/)
					.required()
					.messages({
						"string.pattern.base": "Mobile must be 10 digits",
					}),
			},
		])
		.required(),
	password: Joi.string().required().messages({
		"string.empty": "Password cannot be empty.",
		"any.required": "Password is required.",
	}),
});

//forgot-password-request
const forgotPassRequestSchema = Joi.object({
	type: Joi.string().valid("email", "mobile").required().messages({
		"any.only": "Type must be either email or mobile",
		"string.empty": "Type is required",
	}),
	credential: Joi.alternatives()
		.conditional("type", [
			{
				is: "email",
				then: Joi.string()
					.email({ tlds: { allow: false } })
					.required(),
			},
			{
				is: "mobile",
				then: Joi.string()
					.pattern(/^\d{10}$/)
					.required()
					.messages({
						"string.pattern.base": "Mobile must be 10 digits",
					}),
			},
		])
		.required(),
});

//verify-forgot-password
const verifyForgotPassOtpSchema = Joi.object({
	type: Joi.string().valid("email", "mobile").required().messages({
		"any.only": "Type must be either email or mobile",
		"string.empty": "Type is required",
	}),
	credential: Joi.alternatives()
		.conditional("type", [
			{
				is: "email",
				then: Joi.string()
					.email({ tlds: { allow: false } })
					.required()
					.messages({
						"string.email": "Invalid email format",
						"string.email": "Email is required",
					}),
			},
			{
				is: "mobile",
				then: Joi.string()
					.pattern(/^\d{10}$/)
					.required()
					.messages({
						"string.pattern.base": "Mobile must be 10 digits",
						"string.empty": "Mobile number is required",
					}),
			},
		])
		.required(),
	otp: Joi.string()
		.pattern(/^\d{6}$/)
		.required()
		.messages({
			"string.pattern.base": "Invalid otp",
		}),
});

//forgot-password
const forgotPassSchema = Joi.object({
	
	type: Joi.string().valid("email", "mobile").required(),
	credential: Joi.alternatives()
		.conditional("type", [
			{
				is: "email",
				then: Joi.string()
					.email({ tlds: { allow: false } })
					.required()
					.messages({
						"string.email": "Invalid email format",
						"string.email": "Email is required",
					}),
			},
			{
				is: "mobile",
				then: Joi.string()
					.pattern(/^\d{10}$/)
					.required()
					.messages({
						"string.pattern.base": "Mobile must be 10 digits",
						"string.empty": "Mobile number is required",
					}),
			},
		])
		.required(),
	otp: Joi.string().min(6).max(6).required().messages({
		"string.empty": "Please try to register again session is expired",
	}),
	newPassword: Joi.string()
		.pattern(
			new RegExp(
				"^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$"
			)
		)
		.required()
		.messages({
			"string.pattern.base":
				"Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
			"string.empty": "Password cannot be empty.",
			"any.required": "Password is required.",
		}),
});

module.exports = {
	verifyCredentialSchema,
	verifyOtpRegisterSchema,
	registrationSchema,
	loginSchema,
	forgotPassRequestSchema,
	verifyForgotPassOtpSchema,
	forgotPassSchema
};


