//external module
const nodemailer = require("nodemailer");

//constants
const { COMM_ERROR } = require("../constants/index.js");
const SENDER_EMAIL = process.env.EMAIL_USER;
const { OTP_TYPE, MESSAGE_TYPE } = require("../constants/type.js");

//template prepare services
const {
	prepareVerifyCredentialEmailTemplate,
	prepareForgotPassEmailTemplate,
	prepareTenantDeactivationEmailTemplate,
	prepareTenantDeleteEmailTemplate,
	prepareUserDeactivationEmailTemplate,
	prepareTenantInviteEmailTemplate,
} = require("./prepareEmailFromTemplate.js");

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

async function sendMail(type, destination, metadata = {}) {
	try {
		let preparedEmailTemplate;

		//select which template to prepare
		switch (type) {
			//--AUTH
			case OTP_TYPE.VERIFY_CREDENTIAL:
				preparedEmailTemplate = await prepareVerifyCredentialEmailTemplate(
					destination,
					metadata
				);
				break;

			case OTP_TYPE.FORGOT_PASSWORD:
				preparedEmailTemplate = await prepareForgotPassEmailTemplate(
					destination,
					metadata
				);
				break;

		    //--TENANT: DEACTIVATE, DELETE, PLATFORM-AND-TENANT-INVITE
				//DEACTIVATED
			case MESSAGE_TYPE.TENANT_DEACTIVATED_MSG:
				preparedEmailTemplate = await prepareTenantDeactivationEmailTemplate(
					destination,
					metadata
				);
				break;
				//DELETED
			case MESSAGE_TYPE.TENANT_DELETED_MSG:
				preparedEmailTemplate = await prepareTenantDeleteEmailTemplate(
					destination,
					metadata
				);
				break;
				//PLATFORM-AND-TENANT-INVITE
			case MESSAGE_TYPE.PLATFORM_AND_TENANT_INVITE:
				preparedEmailTemplate = await prepareTenantInviteEmailTemplate(
					destination,
					metadata
				)

			//--USER: DEACTIVATE
			case MESSAGE_TYPE.USER_DEACTIVATED_MSG:
				preparedEmailTemplate = await prepareUserDeactivationEmailTemplate(
					destination,
					metadata
				);
				break;

			default:
				preparedEmailTemplate = null;
		}

		//if there is not template for type of email
		if (!preparedEmailTemplate) {
			throwAppError(COMM_ERROR.TEMPLATE_NOT_FOUND);
		}

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
