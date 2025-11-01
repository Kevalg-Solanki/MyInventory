module.exports = {
	//--403
	USER_DEACTIVATED: {
		code: "USER_DEACTIVATED",
		httpStatus: 403,
		message:
			"Your account is deactivated. Please activate it using the email sent to you.",
	},

	//--404
	USER_NOT_FOUND: {
		code: "USER_NOT_FOUND",
		httpStatus: 404,
		message: "User not found. Please signUp first.",
	},

	//--409
	USER_EXISTS: {
		code: "USER_EXISTS",
		httpStatus: 409,
		message: "User already exist with this credential.",
	},
};
