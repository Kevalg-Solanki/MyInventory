const Joi = require("joi");

const inviteToPlatformSchema = Joi.object({
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


module.exports = {
    inviteToPlatformSchema
}
