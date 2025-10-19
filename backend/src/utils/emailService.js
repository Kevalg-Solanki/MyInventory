//external module
const nodemailer = require("nodemailer");

//template prepare services
const {
	prepareVerifyCredentialEmailTemplate,
} = require("./prepareEmailFromTemplate.js");

//sender mail
const SENDER_EMAIL = process.env.EMAIL_USER;

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
			case "verify-credential":
				preparedEmailTemplate = await prepareVerifyCredentialEmailTemplate(
					destination,
					otp,
					expireIn
				);
		}

		if (!preparedEmailTemplate) {
			return {
				success: false,
				statusCode: 500,

				message: "Template not found for type of email",
			};
		}

		//if failed to prepare template then return error returned by function
		if (!preparedEmailTemplate.success) {
			return preparedEmailTemplate;
		}

		//now send prepared email data to the sendEmailService
		return sendMailService(preparedEmailTemplate);
	} catch (error) {
		console.error("Sending email failed Error At 'sendMail': ", error);
		return {
			success: false,
			statusCode: 500,

			message: "Unable to send OTP. Please try again later.",
		};
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

		return {
			success: true,
			statusCode: 200,

			message: "Email sent successfully",
		};
	} catch (error) {
		console.error("Sending email failed Error At 'sendMailService: ", error);
		return {
			success: false,
			statusCode: 500,

			message: "Failed to send email",
		};
	}
};

module.exports = {
	sendMailService,
	sendMail,
};
