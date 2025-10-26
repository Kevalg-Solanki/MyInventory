//external module
const jwt = require("jsonwebtoken");

//services
const {
	findUserWithCredential,
	getNewOtp,
	saveUserInDatabase,
	loginUser,
	generateAccessTokenViaRefreshToken,
	findUserAndSentOtp,
	verifyForgotPassOtp,
	changeUserPassword,
	checkUserExist,
	sendVericationOtp,
} = require("./auth.service.js");

//utils
const validateOtp = require("../../utils/validateOtp.js");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../../utils/jwtTokenService.js");
const sendResponse = require("../../utils/sendResponse.js");

//constants
const { OTP_TYPE, SESSION_OTP_TYPE } = require("../../constants/auth.js");

//verify-credentials controller
const verifyCredentialAndSendOtp = async (req, res, next) => {
	try {
		//1.destruct
		const { credential, type } = req.body;

		//2.verify credential
		await checkUserExist(credential);

		//3.send otp
		await sendVericationOtp(credential, type);

		//send response
		return sendResponse(res, 200, "Otp sent successfully");
	} catch (error) {
		next(error);
	}
};

//verify-otp-register controller
const verifyOtpForRegistration = async (req, res, next) => {
	try {
		//destruct
		const { credential, otp } = req.body;

		//validate otp
		await validateOtp(OTP_TYPE.VERIFY_CREDENTIAL, credential, otp);

		//if otp is valid then generate otp for registration
		const newOtp = await getNewOtp(credential, SESSION_OTP_TYPE.REGISTRATION);

		//if otp for registraction is generated then
		return sendResponse(res, 200, "OTP verification successfull", { newOtp });
	} catch (error) {
		next(error);
	}
};

//register controller
const register = async (req, res, next) => {
	try {
		const credential =
			req.body?.type == "email" ? req.body?.email : req.body?.mobile;

		//1.check if user exist
		await checkUserExist(credential);

		//2.first verify otp and user exist
		await validateOtp(SESSION_OTP_TYPE.REGISTRATION, credential, req.body?.otp);

		//3. save user in database
		const savedUser = await saveUserInDatabase(req.body);

		//prepare payload
		const { _id, firstName, lastName, email, mobile, isSuperAdmin } = savedUser;

		const payload = {
			_id,
			firstName,
			lastName,
			email,
			mobile,
			isSuperAdmin,
		};

		//4. generate jwt token
		const accessTokenToken = generateAccessToken(payload);

		//5. generate refresh token
		const refreshToken = generateRefreshToken(payload);

		const userDataToSend = {
			_id: _id,
			firstName: firstName,
			lastName: lastName,
			email: email,
			mobile: mobile,
			isSuperAdmin: isSuperAdmin,
		};

		return sendResponse(res, 200, "Registration successfull", {
			userDataToSend,
			refreshToken,
			accessTokenToken,
		});
	} catch (error) {
		next(error);
	}
};

//login
const login = async (req, res, next) => {
	try {
		//call service function to login user
		const { userData, refreshToken, accessToken } = await loginUser(req.body);

		return sendResponse(res, 200, "Login successfull", {
			userData,
			refreshToken,
			accessToken,
		});
	} catch (error) {
		next(error);
	}
};

//fresh token
const refreshToken = async (req, res, next) => {
	try {
		const { refreshToken } = req.body;

		//generate new refresh token
		const newAccessToken = await generateAccessTokenViaRefreshToken(
			refreshToken
		);

		return sendResponse(res, 200, "New session started", {
			accessToken: newAccessToken,
		});
	} catch (error) {
		next(error);
	}
};

//forgot password request
const forgotPassReq = async (req, res, next) => {
	try {
		//extract data
		const { credential, type } = req.body;

		await findUserAndSentOtp(credential, type);

		return sendResponse(res, 200, "OTP sent successfully");
	} catch (error) {
		next(error);
	}
};

//verify forgot password
const verifyOtpForForgotPass = async (req, res, next) => {
	try {
		//destruct
		const { credential, otp } = req.body;

		//verify otp and get new otp for set new password
		const newOtp = await verifyForgotPassOtp(credential, otp);

		return sendResponse(res, 200, "OTP verification complete", { newOtp });
	} catch (error) {
		next(error);
	}
};

//forgot password
const forgotPassword = async (req, res, next) => {
	try {
		//destruct
		const { credential, otp, newPassword } = req.body;

		//validate otp
		await validateOtp(SESSION_OTP_TYPE.FORGOT_PASSWORD, credential, otp);

		//set new password for user
		await changeUserPassword(
			credential,
			newPassword
		);

		return sendResponse(res,200,"Password changed successfully.");
		
	} catch (error) {
		next(error);
	}
};

module.exports = {
	verifyCredentialAndSendOtp,
	verifyOtpForRegistration,
	register,
	login,
	refreshToken,
	forgotPassReq,
	verifyOtpForForgotPass,
	forgotPassword,
};
