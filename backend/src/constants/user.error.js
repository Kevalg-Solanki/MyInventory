module.exports = {
	//--403
	USER_DEACTIVATED: {
		code: "USER_DEACTIVATED",
		httpStatus: 403,
		message:
			"This account is deactivated.",
	},

	//--404
	USER_NOT_FOUND: {
		code: "USER_NOT_FOUND",
		httpStatus: 404,
		message: "User not found.",
	},

	//--409
	USER_EXISTS: {
		code: "USER_EXISTS",
		httpStatus: 409,
		message: "User already exist with this credential.",
	},
};
