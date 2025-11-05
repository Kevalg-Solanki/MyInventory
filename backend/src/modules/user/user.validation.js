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

const updateUserSettingSchema = Joi.object({
	displayPreferences: Joi.object({
		theme: Joi.string().valid("dark", "light").required(),
		saleSummary: Joi.string().valid("none", "week", "month", "year").required(),
	}).required(),
	systemPreferences: Joi.object({
		defaultCurrency: Joi.string().valid("INR").required(),
        locale:Joi.string().valid("en-IN").required(),
		dateTimeFormat: Joi.string()
			.valid("DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD")
			.required(),
		language: Joi.string().required(),
		numberFormat: Joi.string()
			.valid("none", "indian", "international")
			.required(),
	}).required(),
	businessInfos: Joi.object({
		timezone: Joi.string().required(),
	}),
	notifications: Joi.object({
		lowStockNotification: Joi.boolean().required(),
	}),
});

module.exports = {
	updateUserSchema,
	updateUserSettingSchema,
};
