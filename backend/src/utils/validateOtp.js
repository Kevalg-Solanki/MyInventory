//models
const otpModel = require("../modules/otp/otp.model");

//constants
const ERROR = require("../constants/errors");
const AppError = require("./appErrorHandler");

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
			type:type
		});

		if (!existingOtpInDatabase) {
			let error = ERROR.OTP_NOT_AVAILABLE;
			throw new AppError(error?.message,error?.code,error?.httpStatus);
		}

		//2.check otp is expired or not
		if (Date.now() > existingOtpInDatabase.expireIn) {
			let error = ERROR.OTP_EXPIRED;
			throw new AppError(error?.message,error?.code,error?.httpStatus);
		}

		//3.check otp is correct or not
		if (existingOtpInDatabase.otp != otp) {
			let error = ERROR.OTP_INVALID;
			throw new AppError(error?.message,error?.code,error?.httpStatus);
		}

		//first clear otp for user
		await otpModel.deleteMany({destination:credential});

		//if otp exist,not expired,valid then
		return true;
};

module.exports = validateOtp;

