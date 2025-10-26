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




//verify-credentials controller
const verifyCredentialAndSendOtp = async (req, res, next) => {
	try {
		//1.destruct
		const { credential, type } = req.body;

		//2.verify credential
		await checkUserExist(credential);

		//3.send otp 
		await sendVericationOtp(credential,type);

		//send response
		return sendResponse(res,200,"Otp sent successfully");

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
		const registrationOtpResponse = await getNewOtp(credential, "registration");

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
		next(error);
	}
};

//register controller
const register = async (req, res, next) => {
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
		next(error)
	}
};

//login
const login = async (req, res, next) => {
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
		next(error);
	}
};

//fresh token
const refreshToken = async (req, res, next) => {
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
		next(error);
	}
};

//forgot password request
const forgotPassReq = async (req, res, next) => {
	try {
		//extract data
		const { credential, type } = req.body;

		const forgotPassReq = await findUserAndSentOtp(credential, type);

		return res.status(forgotPassReq?.statusCode).json({
			success: forgotPassReq?.success,
			statusCode: forgotPassReq?.statusCode,
			message: forgotPassReq?.message,
		});
	} catch (error) {
		next(error);
	}
};

//verify forgot password
const verifyOtpForForgotPass = async (req, res, next) => {
	try {
		//destruct
		const { credential, otp } = req.body;

		//verify otp
		const verifyOtpResponse = await verifyForgotPassOtp(credential, otp);

		return res.status(verifyOtpResponse?.statusCode).json({
			success: verifyOtpResponse?.success,
			statusCode: verifyOtpResponse?.statusCode,
			message: verifyOtpResponse?.message,
			newOtp: verifyOtpResponse?.newOtp?.newOtp,
		});
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
		const validateOtpResponse = await validateOtp(
			"forgot-password",
			credential,
			otp
		);

		console.log(validateOtpResponse);
		//if otp validation failed
		if (!validateOtpResponse?.success) {
			return {
				success: validateOtpResponse?.success,
				statusCode: validateOtpResponse?.statusCode,
				message: validateOtpResponse?.message,
			};
		}

		//set new password for user
		const setNewPasswordResponse = await changeUserPassword(
			credential,
			newPassword
		);

		return res.status(setNewPasswordResponse?.statusCode).json({
			success: setNewPasswordResponse?.success,
			statusCode: setNewPasswordResponse?.statusCode,
			message: setNewPasswordResponse?.message,
		});
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
