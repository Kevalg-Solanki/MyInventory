//external module
const jwt = require("jsonwebtoken");

//external moduel services
const { sendOtp } = require("../otp/otp.service.js");

//services
const {
	findUserWithCredential,
	getRegistrationOtp,
	saveUserInDatabase,
	loginUser,
	generateAccessTokenViaRefreshToken,
	findUserAndSentOtp
} = require("./auth.service.js");

//utils
const validateOtp = require("../../utils/validateOtp.js");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../../utils/jwtTokenService.js");

//verify-credentials controller
const verifyCredentialAndSendOtp = async (req, res) => {
	try {
		//destruct
		const { credential, type } = req.body;

		//check if user exist
		const existingUserInDatabase = await findUserWithCredential(credential);

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
			throw new Error(sendOtpResult?.message);
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

		//1.check if user exist
		const existingUserInDatabase = await findUserWithCredential(credential);

		if (existingUserInDatabase) {
			return res.status(409).json({
				success: false,
				statusCode: 409,
				message: "User already exist",
			});
		}

		//2.first verify otp and user exist
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

		//3. save user in database
		const saveUserInDatabaseResponse = await saveUserInDatabase(req.body);

		//prepare payload
		const {
			_id,
			profilePicture,
			firstName,
			lastName,
			email,
			mobile,
			isSuperAdmin,
		} = saveUserInDatabaseResponse.savedUser;

		const payload = {
			_id,
			profilePicture,
			firstName,
			lastName,
			email,
			mobile,
			isSuperAdmin,
		};

		//4. generate jwt token
		const accessTokenToken = generateAccessToken(payload);

		//4. generate refresh token
		const refreshToken = generateRefreshToken(payload);

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
			data: {
				userData: { ...userDataToSend },
			},
			accessToken: accessTokenToken,
			refreshToken: refreshToken,
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

//login
const login = async (req, res) => {
	try {
		//call service function to login user
		const loginUserResponse = await loginUser(req.body);

		return res.status(loginUserResponse.statusCode).json({
			success: loginUserResponse.success,
			statusCode: loginUserResponse.statusCode,
			message: loginUserResponse.message,
			data: {
				userData: { ...loginUserResponse.data },
			},
			accessToken: loginUserResponse.accessToken,
			refreshToken: loginUserResponse.refreshToken,
		});
	} catch (error) {
		console.error("Login Failed Error At 'login': ", error);
		return res.status(500).json({
			success: false,
			statusCode: 500,
			message: "Failed to login please try again",
		});
	}
};

//fresh token
const refreshToken = async (req, res) => {
	try {
		const { refreshToken } = req.body;

		//generate new refresh token
		const generatorResponse = await generateAccessTokenViaRefreshToken(
			refreshToken
		);

		return res.status(generatorResponse.statusCode).json({
			success: generatorResponse.success,
			statusCode: generatorResponse.statusCode,
			message: generatorResponse.message,
			accessToken: generatorResponse.newAccessToken,
		});
	} catch (error) {
		console.error("Refreshing Token Failed Error At 'refreshToken': ", error);
		return res.status(500).json({
			success: false,
			statusCode: 500,
			message: "Unable to start new session please login again",
		});
	}
};

//forgot password request
const forgotPassReq = async (req, res) => {
	try {
		//extract data
		const { credential, type } = req.body;

		const forgotPassReq = await findUserAndSentOtp(credential, type);

		return res.status(forgotPassReq?.statusCode).json({
			success:forgotPassReq?.success,
			statusCode:forgotPassReq?.statusCode,
			message:forgotPassReq?.message
		})
		
	} catch (error) {
		console.error(
			"Failed to complete forgot password request Error At 'forgotPassRequest': ",
			error
		);
		return {
			success: false,
			statusCode: 500,
			message: "Unable to complete request please try again",
		};
	}
};

module.exports = {
	verifyCredentialAndSendOtp,
	verifyOtpForRegistration,
	register,
	login,
	refreshToken,
};

