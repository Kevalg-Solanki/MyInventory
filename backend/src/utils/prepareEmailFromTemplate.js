//templates
const verifyCredentialEmailTemplate = require("./templates/verifyCredentialOtpEmailTemplate.js");
const forgotPassOtpEmailTemplate = require("./templates/forgotPassOtpEmailTemplate.js");

/**
 * -function used for prepare email template for verify credential is just replace code in email template
 * @param {string} email - receiver email
 * @param {number} otp - otp
 * @param {number} expireIn - expiry time for otp
 * @returns {Object} - response
 */

const prepareVerifyCredentialEmailTemplate = async (email, otp, expireIn) => {
	try {
		//prepare html template for email to send
		let htmlTemplate = verifyCredentialEmailTemplate.replace(
			"[[verification-code]]",
			otp
		);

		htmlTemplate = htmlTemplate.replace("[[expireIn]]", expireIn);

		return {
			success: true,
			email,
			subject: "Verification Otp for MyInventory",
			text: "Your Verification Otp",
			htmlTemplate,
		};
	} catch (error) {
		console.error(
			"Prepare Email Template failed Error At 'prepareVerifyCredentialEmailTemplate: ",
			error
		);
		return {
			success: false,
			statusCode: 500,

			message: "Failed to prepare email template",
		};
	}
};

const prepareForgotPassEmailTemplate = async (email, otp, expireIn) => {
	try {
		//prepare html template for email to send
		let htmlTemplate = forgotPassOtpEmailTemplate.replace(
			"[[verification-code]]",
			otp
		);

		htmlTemplate = htmlTemplate.replace("[[expireIn]]", expireIn);

		return {
			success: true,
			email,
			subject: "Verification Otp for MyInventory",
			text: "Your Forgot Password Verification Otp",
			htmlTemplate,
		};
	} catch (error) {
		console.error(
			"Prepare Email Template failed Error At 'prepareForgotPassEmailTemplate: ",
			error
		);
		return {
			success: false,
			statusCode: 500,

			message: "Failed to prepare email template",
		};
	}
};

module.exports = {
	prepareVerifyCredentialEmailTemplate,
	prepareForgotPassEmailTemplate
};
