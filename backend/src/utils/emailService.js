//external module
const nodemailer = require("nodemailer");

//constants
const ERROR = require("../constants/errors.js");
const SENDER_EMAIL = process.env.EMAIL_USER;

//template prepare services
const {
	prepareVerifyCredentialEmailTemplate,
	prepareForgotPassEmailTemplate,
} = require("./prepareEmailFromTemplate.js");
const AppError = require("./appErrorHandler.js");
const { OTP_TYPE } = require("../constants/auth.js");

//sender mail


/**
 * -function used for choose which template to prepare according to the type
 *
 * @param {string} type - type of otp (e.g verify-credential, forgot-password)
 * @param {string} destination - email
 * @param {number} otp - otp
 * @param {number} expireIn - time set to expire Otp (In Minutes) default - 5 Minutes
 * @return {Object} - otp sent success or fail and error
 */

const sendMail = async (type, destination, otp, expireIn) => {
	try {
		let preparedEmailTemplate;

		//select which template to prepare
		switch (type) {
			case OTP_TYPE.VERIFY_CREDENTIAL:
				preparedEmailTemplate = await prepareVerifyCredentialEmailTemplate(
					destination,
					otp,
					expireIn
				);
			
			case OTP_TYPE.FORGOT_PASSWORD:
				preparedEmailTemplate = await prepareForgotPassEmailTemplate(
					destination,
					otp,
					expireIn
				);
		}

		//if there is not template for type of email
		if (!preparedEmailTemplate) {

			let error = ERROR.TEMPLATE_NOT_FOUND;
			throw new AppError(error?.message,error?.code,error?.httpStatus);
		}


		//now send prepared email data to the sendEmailService
		return await sendMailService(preparedEmailTemplate);

	} catch (error) {
		throw error;
	}
};

//Create transporter object
const tranposter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: SENDER_EMAIL,
		pass: process.env.EMAIL_APP_PASS,
	},
	tls: {
		rejectUnauthorized: false,
	},
});

/**
 * - function used to send email according to the arguments
 * @param {string} email - receiver email
 * @param {string} subject - subject for email
 * @param {string} text - text for email
 * @param {string} htmlTemplate - html template which will sent on email
 * @returns {Object} - response
 */

const sendMailService = async ({ email, subject, text, htmlTemplate }) => {
	try {
		//prepare object of email to send
		const emailToSent = {
			from: SENDER_EMAIL,
			to: email,
			subject: subject,
			text: text,
			html: htmlTemplate,
		};

		//send email
		const info = await tranposter.sendMail(emailToSent);

		console.log("Email sent: ", info.response);
		return true;

	} catch (error) {
		throw error
	}
};

module.exports = {
	sendMailService,
	sendMail,
};
