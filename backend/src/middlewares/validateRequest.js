//universal function for validation of data with Joi
const validateRequest = (schema) => (req, res, next) => {
	//store error
	const { error } = schema.validate(req.body, { abortEarly: false });

	//if error is exit then send failed response
	if (error) {
		console.error("Validation Error At 'validateRequest' : ", error);
		return res.status(400).json({
			success: false,
			statusCode: 400,

			messasge: "Validation failed",
		});
	}
	next();
};

module.exports = validateRequest;
