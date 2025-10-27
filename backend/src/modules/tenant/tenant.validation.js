const Joi = require("joi");

const createTenantSchema = Joi.object({
	ownerId: Joi.string().required(),
	tenantLogo: Joi.string().optional().allow(null),
	tenantName: Joi.string().required().min(2).max(100).messages({
        "string.empty": "Tenant name is required",
		"string.min": "Tenant name should be at least 2 characters long",
		"string.max": "Tenant name must not exceed 100 characters",
    }),
	tenantSlogan: Joi.string().optional().allow(null),
	tenantCategory: Joi.string().required().messages({
         "string.empty": "Category is required",
    }),
	businessEmail: Joi.string().max(254).optional().allow(null).messages({
        "string.max":"Email character limit exceeded"
    }),
	gstNumber: Joi.string().optional().allow(null),
	longitude: Joi.number().optional().allow(null),
	latitude: Joi.number().optional().allow(null),
	street: Joi.string().min(2).max(30).required().messages({
        "string.empty": "Street name is required",
		"string.min": "Street name should be at least 2 characters long",
		"string.max": "Street name must not exceed 30 characters",
    }),
	landmark: Joi.string().min(2).max(70).required().messages({
        "string.empty": "Landmark name is required",
		"string.min": "Landmark name should be at least 2 characters long",
		"string.max": "Landmark name must not exceed 70 characters",
    }),
	city: Joi.string().min(2).max(30).required().messages({
        "string.empty": "City name is required",
		"string.min": "City name should be at least 2 characters long",
		"string.max": "City name must not exceed 30 characters",
    }),
	state: Joi.string().min(2).max(30).required().messages({
        "string.empty": "State name is required",
		"string.min": "State name should be at least 2 characters long",
		"string.max": "State name must not exceed 30 characters",
    }),
	country: Joi.string().min(2).max(50).required().messages({
        "string.empty": "Country name is required",
		"string.min": "Country name should be at least 2 characters long",
		"string.max": "Country name must not exceed 50 characters",
    }),
	zip:Joi.string().min(2).max(12).required().messages({
        "string.empty": "Zip code is required",
		"string.min": "Zip code should be at least 2 characters long",
		"string.max": "Zip code must not exceed 12 characters",
    })
});


module.exports = {
    createTenantSchema
}
