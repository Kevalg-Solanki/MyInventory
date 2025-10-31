//models
const otpModel = require("../modules/otp/otp.model");

//constants
const ERROR = require("../constants/errors");
const throwAppError = require("./throwAppError.js");

/**
 * @param {string} type - type of otp e.g. verify-credential,registration
 * @param {string} credential - credential for eg. email/mobile
 * @param {string} otp - otp to verify
 * @return {Object} - return otp if found otherwise null
 */

const validateOtp = async (type, credential, otp) => {
	//1.first check otp exist or not
	const existingOtpInDatabase = await otpModel.findOne({
		destination: credential,
		type: type,
	});

	if (!existingOtpInDatabase) {
		throwAppError(ERROR.OTP_NOT_AVAILABLE);
	}

	//2.check otp is expired or not
	if (Date.now() > existingOtpInDatabase.expireIn) {
		throwAppError(ERROR.OTP_EXPIRED);
	}

	//3.check otp is correct or not
	if (existingOtpInDatabase.otp != otp) {
		throwAppError(ERROR.OTP_INVALID);
	}

	//first clear otp for user
	await otpModel.deleteMany({ destination: credential });

	//if otp exist,not expired,valid then
	return true;
};

module.exports = validateOtp;
