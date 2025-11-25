//external modules
const twilio = require("twilio");

//constants
const { OTP_TYPE, MESSAGE_TYPE } = require("../constants/messageType.js");

//service
const throwAppError = require("./throwAppError.js");
const { COMM_ERROR } = require("../constants/index.js");

/**
 *
 * @param {string} type - type of messsage eg.VERIFY-CREDENTIAL,TENANT-DELETE-MSG
 * @param {string} destination - email or mobile
 * @param {object} metadata - data to required to send
 * @returns {null} - throw error if failed
 */
async function sendSms(type, destination, metadata = {}) {
	try {
		//set proper message
		let message;
		console.log(type);
		switch (type) {
			case OTP_TYPE.VERIFY_CREDENTIAL:
				message = `Your verification OTP for MyInventory is ${metadata?.otp}. It will expire in ${metadata?.expiryTime} minutes. If you did not request this, please ignore.`;
				break;

			case OTP_TYPE.FORGOT_PASSWORD:
				message = `Your reset password verification OTP for MyInventory is ${metadata?.otp}. It will expire in ${metadata?.expiryTime} minutes. If you did not request this, please ignore.`;
				break;

			case MESSAGE_TYPE.TENANT_DEACTIVATED_MSG:
				message = `Your ${metadata?.tenantName} tenant is deactivated in MyInventory. Please contact us on support phone number or email if this action was not intended.`;
				break;

			case MESSAGE_TYPE.TENANT_DELETED_MSG:
				message = `Your ${metadata?.tenantName} tenant is deleted from MyInventory. Please contact us on support phone number or email if this action was not intended.`;
				break;

			case MESSAGE_TYPE.TENANT_INVITE:
				message = `Hey! your invited by ${metadata?.invitorName} in ${metadata?.tenantName} (${metadata?.tenantCategory}) at address ${metadata?.tenantAddress}.
				Owned by ${metadata?.tenantOwnerName}. You can accept or reject this invitation by login in MyInventory.`;
				break;

			case MESSAGE_TYPE.PLATFORM_INVITE:
				message = `Hey! your invited by ${metadata?.invitorName} in MyInventory which is smart inventory managment system. Create account by visiting [[url]]`;
				break;

			case MESSAGE_TYPE.USER_DEACTIVATED_MSG:
				message = `Your ${metadata?.userName} account is deleted from MyInventory. Please contact us on support phone number or email if this action was not intended.`;
				break;
			default:
				message = null;
		}

		//

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

module.exports = {
	sendSms,
};
