//models
const otpModel = require("../modules/otp/otp.model");

/**
 * @param {string} type - type of otp e.g. verify-credential,registration
 * @param {string} credential - credential for eg. email/mobile
 * @param {string} otp - otp to verify
 * @return {Object} - return otp if found otherwise null
 */

const validateOtp = async (type, credential, otp) => {
	try {
		//1.first check otp exist or not
		const existingOtpInDatabase = await otpModel.findOne({
			destination: credential,
		});

		if (!existingOtpInDatabase) {
			return {
				success: false,
				statusCode: 404,

				message: "Otp does not exist please generate again",
			};
		}

		//2.check otp is expired or not
		if (Date.now() > existingOtpInDatabase.expireIn) {
			return {
				success: false,
				statusCode: 410,

				message: "Opt has expired please generate new one",
			};
		}

		//3.check otp is correct or not
		if (existingOtpInDatabase.otp != otp) {
			return {
				success: false,
				statusCode: 401,

				message: "Invalid Otp",
			};
		}

		//first clear otp for user
		await otpModel.deleteMany({credential});

		//if otp exist,not expired,valid then
		return {
			success: true,
			statusCode: 200,
			message: "Otp verification successfull",
		};
	} catch (error) {
		console.error("Otp Varification Failed Error At 'validateOtp': ", error);
		return {
			success: false,
			statusCode: 500,
			message: "Failed to validate otp",
		};
	}
};

module.exports = validateOtp;

