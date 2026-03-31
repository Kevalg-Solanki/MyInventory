//models
const otpModel = require("../modules/otp/otp.model");

//constants
const throwAppError = require("./throwAppError.js");
const { OTP_ERROR } = require("../constants/index.js");

/**
 * @param {string} type - type of otp e.g. verify-credential,registration
 * @param {string} credential - credential for eg. email/mobile
 * @param {string} otp - otp to verify
 * @return {Object} - return otp if found otherwise null
 */

async function validateOtp(type, credential, otp){
	//1.first check otp exist or not
	const existingOtpInDatabase = await otpModel.findOne({
		destination: credential,
		type: type,
	});

	if (!existingOtpInDatabase) {
		throwAppError(OTP_ERROR.OTP_NOT_AVAILABLE);
	}

	//2.check otp is expired or not
	if (Date.now() > existingOtpInDatabase.expireIn) {
		throwAppError(OTP_ERROR.OTP_EXPIRED);
	}

	//3.check otp is correct or not
	if (existingOtpInDatabase.otp != otp) {
		throwAppError(OTP_ERROR.OTP_INVALID);
	}

	//first clear otp for user
	await otpModel.deleteMany({ destination: credential });

	//if otp exist,not expired,valid then
	return true;
};

module.exports = validateOtp;
