//universal function for validation of data with Joi
const validateRequest = (schema) => (req, res, next) => {
	//store error
	const { error } = schema.validate(req.body, { abortEarly: false });
	console.log(req.body);
	//if error is exit then send failed response
	if (error) {
		console.error("Validation Error At 'validateRequest' : ", error);
		console.log(error.details[0].message)
		return res.status(400).json({
			success: false,
			statusCode: 400,
			messasge: error.details[0].message,
			code:"VALIDATION_ERROR"
		});
	}
	next();
};

module.exports = validateRequest;
