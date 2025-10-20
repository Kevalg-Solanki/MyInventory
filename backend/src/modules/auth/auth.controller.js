//external module
const jwt = require("jsonwebtoken");

//external moduel services
const { sendOtp } = require("../otp/otp.service.js");

//services
const {
	checkUserExistWithCredential,
	getRegistrationOtp,
	saveUserInDatabase,
} = require("./auth.service.js");

//utils
const validateOtp = require("../../utils/validateOtp.js");

//verify-credentials controller
const verifyCredentialAndSendOtp = async (req, res) => {
	try {
		//destruct
		const { credential, type } = req.body;

		//check if user exist
		const existingUserInDatabase = await checkUserExistWithCredential(
			credential
		);

		if (existingUserInDatabase) {
			return res.status(409).json({
				success: false,
				statusCode: 409,

				message: "User already exist",
			});
		}

		//if user does not exist than
		//send otp on the email/mobile.
		const sendOtpResult = await sendOtp(
			"verify-credential",
			type,
			credential,
			process.env.VERIFY_CRED_OTP_EXPIRY
		);

		//if failed to sent otp
		if (!sendOtpResult.success) {
			throw new Error(sendOtpResult.error);
		}

		return res.status(200).json({
			success: true,
			statusCode: 200,
			message: `Otp sent successfully`,
		});
	} catch (error) {
		console.error(
			"Verify Credentials Failed Error At 'verifyCredentialAndSendOtp: ",
			error
		);
		return res.status(500).json({
			success: false,
			statusCode: 500,
			message: "Failed to send otp please try again",
		});
	}
};

//verify-otp-register controller
const verifyOtpForRegistration = async (req, res) => {
	try {
		//destruct
		const { credential, otp } = req.body;

		//validate otp
		const validateOtpResponse = await validateOtp(
			"verify-credential",
			credential,
			otp
		);

		//if error on validation or invalid otp
		if (!validateOtpResponse.success) {
			return res.status(validateOtpResponse.statusCode).json({
				success: validateOtpResponse.success,
				statusCode: validateOtpResponse.statusCode,

				message: validateOtpResponse.message,
			});
		}

		//if otp is valid then generate otp for registration
		const registrationOtpResponse = await getRegistrationOtp(credential);

		//if error on generating registraction otp
		if (!registrationOtpResponse.success) {
			throw new Error(registrationOtpResponse.error);
		}

		//if otp for registraction is generated then
		return res.status(200).json({
			success: true,
			statusCode: 200,

			registrationOtp: registrationOtpResponse.newOtp,
			messsage: "Otp verification successfull",
		});
	} catch (error) {
		console.error(
			"Otp Verification Failed Error At 'verifyOtpForRegistration': ",
			error
		);
		return res.status(500).json({
			success: false,
			statusCode: 500,

			message: "Otp Verfication Failed",
		});
	}
};

//register controller
const register = async (req, res) => {
	try {
		const credential =
			req.body?.type == "email" ? req.body?.email : req.body?.mobile;

		//check if user exist
		const existingUserInDatabase = await checkUserExistWithCredential(
			credential
		);

		if (existingUserInDatabase) {
			return res.status(409).json({
				success: false,
				statusCode: 409,
				message: "User already exist",
			});
		}

		//first verify otp and user exist
		const validateOtpResponse = await validateOtp(
			"registration",
			credential,
			req.body?.otp
		);

		//if error on validation or invalid otp
		if (!validateOtpResponse?.success) {
			return res.status(validateOtpResponse?.statusCode).json({
				success: validateOtpResponse?.success,
				statusCode: validateOtpResponse?.statusCode,

				message: validateOtpResponse?.message,
			});
		}

		//save user in database
		const saveUserInDatabaseResponse = await saveUserInDatabase(req.body);

		console.log(saveUserInDatabaseResponse);

		const {
			_id,
			profilePicture,
			firstName,
			lastName,
			email,
			mobile,
			isSuperAdmin,
		} = saveUserInDatabaseResponse.savedUser;
		//generate jwt token
		const jwtToken = jwt.sign(
			{
				_id: _id,
				profilePicture: profilePicture,
				firstName: firstName,
				lastName: lastName,
				email: email,
				mobile: mobile,
				isSuperAdmin: isSuperAdmin,
			},
			process.env.JWT_SECRETE,
			{ expiresIn: process.env.JWT_TOKEN_EXPIRY }
		);

		//generate refresh token
		const jwtRefreshToken = jwt.sign(
			{
				_id: _id,
				profilePicture: profilePicture,
				firstName: firstName,
				lastName: lastName,
				email: email,
				mobile: mobile,
				isSuperAdmin: isSuperAdmin,
			},
			process.env.JWT_SECRETE,
			{ expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY }
		);

		const userDataToSend = {
			_id: _id,
			profilePicture: profilePicture,
			firstName: firstName,
			lastName: lastName,
			email: email,
			mobile: mobile,
			isSuperAdmin: isSuperAdmin,
		};

		return res.status(200).json({
			success: true,
			statusCode: 200,

			message: "Registration Successfull",
			data: userDataToSend,
			accessToken: jwtToken,
			refreshToken: jwtRefreshToken,
		});
	} catch (error) {
		console.error("Registration Failed Error At 'register': ", error);
		return res.status(500).json({
			success: false,
			statusCode: 500,

			message: "Registration Failed Please try again",
		});
	}
};

module.exports = {
	verifyCredentialAndSendOtp,
	verifyOtpForRegistration,
	register,
};
