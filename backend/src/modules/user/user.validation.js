const Joi = require("joi");

const updateUserSchema = Joi.object({
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
});

module.exports = {
	updateUserSchema,
};
