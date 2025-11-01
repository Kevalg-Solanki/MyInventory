module.exports = {
	PASS: {
		PASSWORD_INCORRECT: {
			code: "PASSWORD_INCORRECT",
			httpStatus: 401,
			message: "Incorrect password.",
		},
		PASSWORD_RESET_FAILED: {
			code: "PASSWORD_RESET_FAILED",
			httpStatus: 401,
			message: "Failed to change password.",
		},
	},

	TOKEN: {
		TOKEN_NOT_FOUND: {
			code: "TOKEN_NOT_FOUND",
			httpStatus: 400,
			message: "Token is required.",
		},
		TOKEN_INVALID: {
			code: "TOKEN_INVALID",
			httpStatus: 401,
			message: "Unauthorized - Invalid token.",
		},
		TOKEN_EXPIRED: {
			code: "TOKEN_EXPIRED",
			httpStatus: 401,
			message: "Token is expired.",
		},
	},

	OTP: {
		OTP_NOT_AVAILABLE: {
			code: "OTP_NOT_AVAILABLE",
			httpStatus: 404,
			message: "OTP not available. Please generate again.",
		},
		OTP_EXPIRED: {
			code: "OTP_EXPIRED",
			httpStatus: 410,
			message: "OTP has expired. Please generate new one.",
		},
		OTP_INVALID: {
			code: "OTP_INVALID",
			httpStatus: 401,
			message: "Invalid OTP",
		},
	},

	ID: {
		OBJECTID_INVALID: {
			code: "OBJECTID_INVALID",
			httpStatus: 400,
			message: "Id is invalid.",
		},
	},

	AUTH: {
		REQUEST_INVALID: {
			code: "REQUEST_INVALID",
			httpStatus: 400,
			message: "Invalid request. Please try to login again.",
		},

		UNAUTHORIZED_ACCESS: {
			code: "UNAUTHORIZED_ACCESS",
			httpStatus: 401,
			message: "Unauthorized access.",
		},

		ACCESS_DENIED: {
			code: "ACCESS_DENIED",
			httpStatus: 403,
			message: "Access denied.",
		},
	},
};
