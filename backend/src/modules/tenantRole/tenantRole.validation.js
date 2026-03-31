//external modules
const Joi = require("joi");

//constants
const PERMS = require("../../constants/permission");

//extract enum like string from permission object
const allowedPermsValues = Object.values(PERMS);

const createTenantCustomRoleSchema = Joi.object({
	roleName: Joi.string().max(30).allow(null).required(),
	roleColor: Joi.string().max(7).allow(null).required(),
	permissions: Joi.array()
		.items(Joi.string().valid(...allowedPermsValues).messages({
			"any.only":"Permission is not valid. Please use recognized permission."
		}))
		.min(0)
		.unique()
		.required().messages({
			"any.required":"Permission field is required."
		}),
	isActive: Joi.boolean().valid(true, false).required(),
});

const updateTenantCustomRoleDetailsSchema = Joi.object({
	roleName: Joi.string().min(2).max(30).required(),
	roleColor: Joi.string().min(7).max(7).required(),
	permissions: Joi.array()
		.items(Joi.string().valid(...allowedPermsValues).messages({
			"any.only":"Permission is not valid. Please use recognized permission."
		}))
		.min(0)
		.unique()
		.required(),
	isActive: Joi.boolean().valid(true, false).required(),
});

module.exports = {
	createTenantCustomRoleSchema,
	updateTenantCustomRoleDetailsSchema,
};
