//external modules
const twilio = require("twilio");

//constants
const ERROR = require("../constants/errors.js");
const { OTP_TYPE,MESSAGE_TYPE } = require("../constants/emailAndSms.js");



//service
const throwAppError = require("./throwAppError.js");


const sendSms = async (type, destination,metadata) => {
	try {
		//set proper message
		let message;
		console.log(type,OTP_TYPE.VERIFY_CREDENTIAL)
		switch (type) {
			case OTP_TYPE.VERIFY_CREDENTIAL:
				message = `Your verification OTP for MyInventory is ${metadata?.otp}. It will expire in ${metadata?.expiryTime} minutes. If you did not request this, please ignore.`;
				break;

			case OTP_TYPE.FORGOT_PASSWORD:
				message = `Your reset password verification OTP for MyInventory is ${metadata?.otp}. It will expire in ${metadata?.expiryTime} minutes. If you did not request this, please ignore.`;
				break;

			case MESSAGE_TYPE.TENANT_DEACTIVATED_MSG:
				message = `Your ${metadata?.tenantName} tenant is deactivated in MyInventory. Please contact us on support phone number or email if this action was not intended.`
				break;

			case MESSAGE_TYPE.TENANT_DELETED_MSG:
				message = `Your ${metadata?.tenantName} tenant is deleted from MyInventory. Please contact us on support phone number or email if this action was not intended.`
				break;

			default:
				message= null;
		}

		//
		
		if(!message) throwAppError(ERROR.OTP_INVALID)

		return await sendSmsService(destination, message);
	} catch (error) {
		throw error;
	}
};

//SMS service

//create client
const client = twilio(
	process.env.TWILIO_ACCOUNT_SID,
	process.env.TWILIO_AUTH_TOKEN
);

const sendSmsService = async (destination, message) => {
    try
    {
        //send message
        const twilioResponse = await client.messages.create({
            body:message,
            from: process.env.TWILIO_PHONE_NUMBER,
            to: `+91${destination}`
        })
      
        return true;
    }
    catch(error)
    {
		throwAppError(ERROR.SMS_SEND_FAILED);

    }
};


module.exports = {
    sendSms,

}