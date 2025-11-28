//external module
const nodemailer = require("nodemailer");

//constants
const { COMM_ERROR } = require("../constants/index.js");
const SENDER_EMAIL = process.env.EMAIL_USER;

//template prepare services
const prepareEmailTemplate = require("./prepareEmailTemplate.js");

//utils
const throwAppError = require("./throwAppError.js");

//sender mail

/**
 * -function used for choose which template to prepare according to the type
 *
 * @param {string} type - type of otp (e.g verify-credential, forgot-password)
 * @param {string} destination - email
 * @param {Object} metadata - data to include in email
 * @return {Object} - otp sent success or fail and error
 */

async function sendMail(emailType, destination, metadata = {}) {
	try {

		let preparedEmailTemplate = await prepareEmailTemplate(
			emailType,
			destination,
			metadata
		);

		//if there is not template for type of email
		if (!preparedEmailTemplate) throwAppError(COMM_ERROR.TEMPLATE_NOT_FOUND);
		

		//now send prepared email data to the sendEmailService
		return await sendMailService(preparedEmailTemplate);
		
	} catch (error) {
		throw error;
	}
}

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

async function sendMailService({ email, subject, text, htmlTemplate }) {
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
		throw error;
	}
}

module.exports = {
	sendMailService,
	sendMail,
};
