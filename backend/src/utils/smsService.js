//external modules
const twilio = require("twilio");

//constants
const ERROR = require("../constants/errors.js");
const { OTP_TYPE,MESSAGE_TYPE } = require("../constants/emailAndSms.js");



//service
const AppError = require("./appErrorHandler");


const sendSms = async (type, destination,metadata) => {
	try {
		//set proper message
		let message;
		
		switch (type) {
			case OTP_TYPE.VERIFY_CREDENTIAL:
				message = `Your verification OTP for MyInventory is ${metadata?.otp}. It will expire in ${metadata?.expiryTime} minutes. If you did not request this, please ignore.`;

			case OTP_TYPE.FORGOT_PASSWORD:
				message = `Your reset password verification OTP for MyInventory is ${metadata?.otp}. It will expire in ${metadata?.expiryTime} minutes. If you did not request this, please ignore.`;

			case MESSAGE_TYPE.TENANT_DEACTIVATED_MSG:
				message = `Your ${metadata?.tenantName} tenant is deactivated in MyInventory. Please contact us on support phone number or email if this action was not intended.`

			case MESSAGE_TYPE.TENANT_DELETED_MSG:
				message = `Your ${metadata?.tenantName} tenant is deleted from MyInventory. Please contact us on support phone number or email if this action was not intended.`

		}

		//
		let error = ERROR.OTP_INVALID;
		if(!message) throw new AppError(error?.message,error?.code,error?.httpStatus);

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
		let err = ERROR.SMS_SEND_FAILED;
		throw new AppError(err?.message,err?.code,err?.httpStatus);
    }
};


module.exports = {
    sendSms,

}