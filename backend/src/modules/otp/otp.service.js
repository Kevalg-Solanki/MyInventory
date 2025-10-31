//models
const otpModel = require("./otp.model.js");

//utils
const { generateOtp } = require("../../utils/otpGenerator.js");
const { sendMail } = require("../../utils/emailService.js");
const { sendSms } = require("../../utils/smsService.js");
const throwAppError = require("../../utils/throwAppError.js");

/**
 * -Function used to generate otp and send to destination email or mobile
 *
 * @param {string} type - type of otp (e.g verify-credential, forgot-password)
 * @param {string} method - method (email or mobile)
 * @param {string} destination - email or mobile number
 * @param {number} expiryTime - time set to expire Otp (In Minutes) default - 5 Minutes
 * @return {Object} - otp sent success or fail and error
 */

const sendOtp = async (type, method, destination, expiryTime = 5) => {
	try {
		//clear all existing otp for user first
		await otpModel.deleteMany({
			destination,
		});

		//generate otp
		const otp = await generateOtp();

		//set expiry time
		const expireIn = Date.now() + Number(expiryTime)  * 60 * 1000; //expire in min

		//save otp to database
		const otpToSaveInDatabase = new otpModel({
			type,
			destination,
			otp,
			expireIn,
		});

		//save to database
		await otpToSaveInDatabase.save();

		let result;

		//decide otp sent to email or mobile
		if (method == "email") {
			result = await sendMail(type, destination,{otp, expiryTime});
		}

		if (method == "mobile") {
			result = await sendSms(type, destination,{otp, expiryTime});
		}

		return result;
	} catch (error) {
		throw error;
	}
};

module.exports = {
	sendOtp,
};
