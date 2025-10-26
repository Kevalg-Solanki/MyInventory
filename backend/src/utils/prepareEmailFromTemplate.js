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

};

const prepareForgotPassEmailTemplate = async (email, otp, expireIn) => {

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
};

module.exports = {
	prepareVerifyCredentialEmailTemplate,
	prepareForgotPassEmailTemplate,
};
