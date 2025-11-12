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
		.items(Joi.string().valid(...allowedPermsValues))
		.min(0)
        .unique()
		.required(),
	isActive: Joi.boolean().valid(true, false).required(),
});

module.exports = {
	createTenantCustomRoleSchema
};
