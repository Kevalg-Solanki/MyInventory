module.exports = {
	USER_EXISTS: {
        code:"USER_EXISTS",
		httpStatus: 409,
		message: "User already exist with this credential.",
	},
    USER_NOT_FOUND:{
        code:"USER_NOT_FOUND",
        httpStatus:404,
        message: "User not found. Please signUp first."
    },
    USER_DEACTIVATED:{
        code:"USER_DEACTIVATED",
        httpStatus:403,
        message: "Your account is deactivated. Please activate it using the email sent to you."
    },
    PASSWORD_INCORRECT:{
        code:"PASSWORD_INCORRECT",
        httpStatus:401,
        message: "Incorrect password."
    },
    PASSWORD_RESET_FAILED:{
        code:"PASSWORD_RESET_FAILED",
        httpStatus:401,
        message: "Failed to change password."
    },
    TOKEN_NOT_FOUND:{
        code:"TOKEN_NOT_FOUND",
        httpStatus:400,
        message: "Token is required."
    },
    TOKEN_EXPIRED:{
        code:"TOKEN_EXPIRED",
        httpStatus:401,
        message:"Token is expired."
    },
	EMAIL_SEND_FAILED: {
        code:"EMAI_SEND_FAILED",
		httpStatus: 502,
		message: "Failed to send email. Please try again later.",
	},
    SMS_SEND_FAILED: {
        code:"SMS_SEND_FAILED",
		httpStatus: 502,
		message: "Failed to send OTP. Please try again later.",
	},
    TEMPLATE_NOT_FOUND:{
        code:"TEMPLATE_NOT_FOUND",
        httpStatus:500,
        message:"Failed to send email. Please try again later."
    },
    OTP_NOT_AVAILABLE:{
        code:"OTP_NOT_AVAILABLE",
        httStatus:404,
        message:"OTP not available. Please generate again."
    },
    OTP_EXPIRED:{
        code:"OTP_EXPIRED",
        httStatus:410,
        message:"OTP has expired. Please generate new one."
    },
     OTP_INVALID:{
        code:"OTP_INVALID",
        httStatus:401,
        message:"Invalid OTP"
    },


};
