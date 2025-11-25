module.exports = {
	
	//--400
	MESSAGE_INVALID: {
		code: "MESSAGE_INVALID",
		httpStatus: 400,
		message: "Failed to send message. Please try again later.",
	},
	UNSUPPORTED_CREDENTIAL_TYPE:{
		code:"UNSUPPORTED_CREDENTIAL_TYPE",
		httpStatus:400,
		message: "This type is not supported. Please try refresh the page.",
	},

	//--500
	TEMPLATE_NOT_FOUND: {
		code: "TEMPLATE_NOT_FOUND",
		httpStatus: 500,
		message: "Failed to send email. Please try again later.",
	},

	//--502
	EMAIL_SEND_FAILED: {
		code: "EMAI_SEND_FAILED",
		httpStatus: 502,
		message: "Failed to send email. Please try again later.",
	},
	SMS_SEND_FAILED: {
		code: "SMS_SEND_FAILED",
		httpStatus: 502,
		message: "Failed to send SMS. Please try again later.",
	},
};
