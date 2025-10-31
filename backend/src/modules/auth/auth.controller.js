//external module
const jwt = require("jsonwebtoken");

//services
const {
	findUserByCredential,
	getNewOtp,
	saveUserInDatabase,
	loginUser,
	generateAccessTokenViaRefreshToken,
	findUserAndSentOtp,
	verifyForgotPassOtp,
	changeUserPassword,
	assertUserDoesNotExistByCredential,
	sendVericationOtp,
	findUserById,
	checkUseExistAndActiveById,
	verifyOldPassAndSetNewPass,
} = require("./auth.service.js");

//utils
const validateOtp = require("../../utils/validateOtp.js");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../../utils/jwtTokenService.js");
const sendResponse = require("../../utils/sendResponse.js");

//constants
const {
	OTP_TYPE,
	SESSION_OTP_TYPE,
} = require("../../constants/emailAndSms.js");
const { UserClass } = require("../user/user.model.js");

//verify-credentials controller
const verifyCredentialAndSendOtp = async (req, res, next) => {
	try {
		const { credential, type } = req.body;

		await assertUserDoesNotExistByCredential(credential);

		await sendVericationOtp(credential, type);

		return sendResponse(res, 200, "Otp sent successfully");
	} catch (error) {
		next(error);
	}
};

//verify-otp-register controller
const verifyOtpForRegistration = async (req, res, next) => {
	try {
		const { credential, otp } = req.body;

		await validateOtp(OTP_TYPE.VERIFY_CREDENTIAL, credential, otp);

		const newOtp = await getNewOtp(credential, SESSION_OTP_TYPE.REGISTRATION);

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

		await assertUserDoesNotExistByCredential(credential);

		await validateOtp(SESSION_OTP_TYPE.REGISTRATION, credential, req.body?.otp);

		const savedUser = await saveUserInDatabase(req.body);

		const { _id, firstName, lastName, email, mobile, isSuperAdmin } = savedUser;

		const payload = {
			_id,
			firstName,
			lastName,
			email,
			mobile,
			isSuperAdmin,
		};

		const accessToken = generateAccessToken(payload);

		const refreshToken = generateRefreshToken(payload);

		const userDataToSend = {
			_id: _id,
			firstName: firstName,
			lastName: lastName,
			email: email,
			mobile: mobile,
			isSuperAdmin: isSuperAdmin,
		};

		return sendResponse(res, 201, "Registration successful", {
			userDataToSend,
			refreshToken,
			accessToken,
		});
	} catch (error) {
		next(error);
	}
};

//login
const login = async (req, res, next) => {
	try {
		const { userData, refreshToken, accessToken } = await loginUser(req.body);

		return sendResponse(res, 200, "Login successful", {
			userData,
			refreshToken,
			accessToken,
		});
	} catch (error) {
		next(error);
	}
};

//refresh token
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
		const { credential, type } = req.body;

		await findUserAndSentOtp(credential, type);

		return sendResponse(res, 201, "If an account exists, an OTP has been sent");
	} catch (error) {
		next(error);
	}
};

//verify forgot password
const verifyOtpForForgotPass = async (req, res, next) => {
	try {
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
		const { credential, otp, newPassword } = req.body;

		await validateOtp(SESSION_OTP_TYPE.FORGOT_PASSWORD, credential, otp);

		await changeUserPassword(credential, newPassword);

		return sendResponse(res, 200, "Password changed successfully.");
	} catch (error) {
		next(error);
	}
};

//reset password
const resetPassword = async (req, res, next) => {
	try {
		const { userId, oldPassword, newPassword } = req.body;

		//check user exist and active
		const userInDatabase = await checkUseExistAndActiveById(userId);

		const user = new UserClass(userInDatabase);

		await verifyOldPassAndSetNewPass(user, oldPassword, newPassword);

		return sendResponse(res, 200, "Password changed successfully");
	} catch (error) {
		next(error);
	}
};

//get user
const getUserDataById = async (req, res, next) => {
	try {
		const userData = req.user;

		return sendResponse(res, 200, "User fetched successfully", { userData });
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
	resetPassword,
	getUserDataById,
};
