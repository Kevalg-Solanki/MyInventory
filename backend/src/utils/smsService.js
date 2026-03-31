//external modules
const twilio = require("twilio");

//constants
const { COMM_ERROR } = require("../constants/index.js");

//utils
const throwAppError = require("./throwAppError.js");
const prepareSms = require("./prepareSms.js");

/**
 *
 * @param {string} type - type of messsage eg.VERIFY-CREDENTIAL,TENANT-DELETE-MSG
 * @param {string} destination - email or mobile
 * @param {object} metadata - data to required to send
 * @returns {null} - throw error if failed
 */
async function sendSms(smsType, destination, metadata = {}) {
	try {
		//set proper message
		let message;
		console.log(smsType);
		console.log(metadata)
	
		message = await prepareSms(smsType,metadata);

		if (!message) throwAppError(COMM_ERROR.MESSAGE_INVALID);

		return await sendSmsService(destination, message);
	} catch (error) {
		throw error;
	}
}

//SMS service

//create client
const client = twilio(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN
);

async function sendSmsService(destination, message) {
	try {
		//send message
		const twilioResponse = await client.messages.create({
			body: message,
			from: process.env.TWILIO_PHONE_NUMBER,
			to: `+91${destination}`,
		});

		return true;
	} catch (error) {
		throwAppError(COMM_ERROR.SMS_SEND_FAILED);
	}
}

module.exports = {sendSms};
