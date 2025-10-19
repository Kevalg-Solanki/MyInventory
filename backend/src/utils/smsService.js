//external modules
const twilio = require("twilio");

const sendSms = async (type, destination, otp, expiryTime) => {
	try {
		//set proper message
		let message;

        console.log(type);
		switch (type) {
			case "verify-credential":
				message = `Your verification OTP for MyInventory is ${otp}. It will expire in ${expiryTime} minutes. If you did not request this, please ignore.`;

		}

        if(!message) throw new Error("Invalid otp type");

		return await sendSmsService(destination, message);
	} catch (error) {
		console.error("Sending SMS message failed Error At 'sendSms': ", error);
		return {
			success: false,
			statusCode: 500,

			message: "Unable to send OTP. Please try again later.",
		};
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
        console.log("twilio message",twilioResponse);
        return {
            success:true,
            statusCode:200,
        }
    }
    catch(error)
    {
		return {
			success: false,
			statusCode: 500,
            error:error,//sending error to log not in response
			message: "Unable to send OTP. Please try again later.",
		};
    }
};


module.exports = {
    sendSms,

}