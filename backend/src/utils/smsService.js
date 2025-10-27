//external modules
const twilio = require("twilio");

//constants
const ERROR = require("../constants/errors.js");
const { OTP_TYPE } = require("../constants/auth.js");
//service
const AppError = require("./appErrorHandler");


const sendSms = async (type, destination, otp, expiryTime) => {
	try {
		//set proper message
		let message;

		switch (type) {
			case OTP_TYPE.VERIFY_CREDENTIAL:
				message = `Your verification OTP for MyInventory is ${otp}. It will expire in ${expiryTime} minutes. If you did not request this, please ignore.`;

			case OTP_TYPE.FORGOT_PASSWORD:
				message = `Your reset password verification OTP for MyInventory is ${otp}. It will expire in ${expiryTime} minutes. If you did not request this, please ignore.`;

		}

		//
		let error = ERROR.OTP_INVALID;
		if(!message) throw new AppError(error?.message,error?.code,error?.httStatus);

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