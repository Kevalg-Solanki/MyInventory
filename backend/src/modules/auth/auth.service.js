//external modules
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//models
const otpModel = require("../otp/otp.model");
const { UserModel, UserClass } = require("../user/user.model");

//utils
const { generateOtp } = require("../../utils/otpGenerator.js");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../../utils/jwtTokenService.js");
const { sendOtp } = require("../otp/otp.service.js");
const validateOtp = require("../../utils/validateOtp.js");

/**
 * -find user with credential in database
 * @param {string} credential - credential with find user
 * @return {Object} - if user exist returns user info or if not then returns null
 */

const findUserWithCredential = async (credential) => {
	//find and return user
	return await UserModel.findOne({
		$or: [{ email: credential }, { mobile: credential }],
		isDeleted: false,
	});
};

/**
 *
 * @param {string} credential - email/mobile
 * @returns {Object}
 */
const checkUserExistAndActive = async (credential) => {
	try {
		const userInDatabase = await findUserWithCredential(credential);

		if (!userInDatabase) {
			return {
				success: false,
				statusCode: 404,
				message: "User does not exist please signup first",
			};
		}

		const user = new UserClass(userInDatabase);

		//check user active
		if (!user.isUserAccountActive()) {
			return {
				success: false,
				statusCode: 403,
				message: "Your account is deactivated.",
			};
		}

		return {
			success: true,
			userInDatabase,
		};
	} catch (error) {
		console.error(
			"Failed to check user exist and active Error At 'checkUserExistAndActive': ",
			error
		);
		return {
			success: false,
			statusCode: 500,
			message: "Something went wrong!",
		};
	}
};

/**
 * -find user with credential in database
 * @param {string} destination - email/mobile of user who trying to register
 * @param {string} type - type of otp
 * @return {Object} - returns newOtp
 */
const getNewOtp = async (destination, type) => {
	try {
		//generate new otp for registration
		//clear all existing otp for user first
		await otpModel.deleteMany({
			destination,
		});

		//generate otp
		const newOtp = await generateOtp();

		//set expiry time
		const newExpireIn =
			Date.now() + process.env.REGISTER_OTP_EXPIRY * 60 * 1000; //expire in min

		//save otp to database
		const otpToSaveInDatabase = new otpModel({
			type: type,
			destination,
			otp: newOtp,
			expireIn: newExpireIn,
		});

		//save to database
		await otpToSaveInDatabase.save();

		return {
			success: true,
			newOtp,
		};
	} catch (error) {
		console.error(
			"Registration otp generation failed Error At 'getNewOtp': ",
			error
		);
		return {
			success: false,
			statusCode: 500,

			messages: "Failed to generate new otp please try again",
		};
	}
};

/**
 *
 * @param {string} credential - email/mobile of user
 * @param {string} newPassword - new hashed password
 * @returns {Object} - response
 */
const setNewPassword = async (credential, newPassword) => {
	//hash password
	const hashedPassword = await bcrypt.hash(newPassword, 10);
	console.log("set new passowrd")
	//set new password
	const updatedUser  = await UserModel.findOneAndUpdate(
		{ $or:[{email:credential},{mobile:credential}] },
		{ $set: { password: hashedPassword } },
		{ new: true, runValidators: true }
	);

	return updatedUser;

};

/**
 *
 * @param {Object} userData - user data to save
 * @return {Object}- saved user data
 */
const saveUserInDatabase = async (userData) => {
	try {
		//1.hash password
		const hashedPassword = await bcrypt.hash(userData?.password, 10);

		//2.save user in database
		const userToSave = new UserModel({
			profilePicture: userData.profilePicture,
			firstName: userData.firstName,
			lastName: userData.lastName,
			email: userData.email,
			mobile: userData.mobile,
			password: hashedPassword,
		});

		//save and get saved user informations
		const savedUser = await userToSave.save();

		return {
			success: true,
			savedUser,
		};
	} catch (error) {
		console.error("Registration failed Error At 'saveUserInDatabase': ", error);
		return {
			success: false,
			statusCode: 500,
			savedUser: null,
			messages: "Failed to register please try again",
		};
	}
};

/**
 *
 * @param {Object} userData - user data recieved in request
 * @returns - userDetails from database and tokens
 */
const loginUser = async (userData) => {
	try {
		//1. find user in database
		const userInDatabase = await findUserWithCredential(userData.credential);

		//if user does not exist
		if (!userInDatabase) {
			return {
				success: false,
				statusCode: 404,
				message: "User not found please signUp first",
			};
		}

		//2. Create object of user
		const user = new UserClass(userInDatabase);

		//3. Verify user password
		const isMatched = await user.verifyPassword(userData.password);

		console.log
		//if password does not match
		if (!isMatched) {
			return {
				success: false,
				statusCode: 401,
				message: "Password incorrect",
			};
		}

		//check user account is activate or not
		const isActive = user.isUserAccountActive();

		//if diactived user account
		if (!isActive) {
			return {
				success: false,
				statusCode: 403,
				message:
					"Your account is deactivated. Please activate it using the email sent to you.",
			};
		}

		//if active
		//create access and refresh token
		const payload = await user.getUserInfo();

		//generate access and refresh token
		const accessToken = generateAccessToken(payload);
		const refreshToken = generateRefreshToken(payload);

		//return user info and token
		return {
			success: true,
			statusCode: 200,
			data: { ...payload },
			accessToken,
			refreshToken,
		};
	} catch (error) {
		console.error("Login failed Error At 'loginUser': ", error);

		return {
			success: false,
			statusCode: 500,
			message: "Unable to login please try again",
		};
	}
};

/**
 * @param {string} refreshToken - refresh token came in request with which new access token will generated
 * @return {Object} - new access token
 */
const generateAccessTokenViaRefreshToken = async (refreshToken) => {
	try {
		//check refreshToken exist
		if (!refreshToken) {
			return {
				success: false,
				statusCode: 400,
				message: "Refresh token is required",
			};
		}

		//verify and decod token
		const decoded = jwt.verify(refreshToken, process.env.JWT_SECRETE);

		//check if user exist and active
		const userDataFromDatabase = await UserModel.findById(decoded._id);

		//if user not found
		if (!userDataFromDatabase || userDataFromDatabase.isDeleted) {
			return {
				success: false,
				statusCode: 404,
				message: "User not found please signUp first",
			};
		}

		//check if user active
		if (!userDataFromDatabase.isActive) {
			return {
				success: false,
				statusCode: 403,
				message: "Your account is deactivated.",
			};
		}

		//create object of user class
		const user = new UserClass(userDataFromDatabase);

		//create payload
		const payload = await user.getUserInfo();

		//generate new access token
		const newAccessToken = generateAccessToken(payload);

		return {
			success: true,
			statusCode: 200,
			message: "New session started",
			newAccessToken,
		};
	} catch (error) {
		console.error(
			"Failed to generate access token Error At 'generateAccessTokenByRefreshToken': ",
			error
		);
		return {
			success: false,
			statusCode: 500,
			message: "Unable to start new session please login again.",
		};
	}
};

/**
 * @param {string} credential - example@gmail.com/999989898
 * @param {string} type - email/mobile
 * @return {Object} - response success/fail
 */

const findUserAndSentOtp = async (credential, type) => {
	try {
		//first check user
		const checkUser = await checkUserExistAndActive(credential);

		if (!checkUser.success) {
			return {
				success: false,
				statusCode: checkUser?.statusCode,
				message: checkUser?.message,
			};
		}

		//if user active then sent otp on credential
		const sentOtpResponse = await sendOtp("forgot-password", type, credential);

		//if there is erro
		if (!sentOtpResponse.success) {
			return {
				success: sentOtpResponse?.success,
				statusCode: sentOtpResponse?.statusCode,
				message: sentOtpResponse?.message,
			};
		}

		return {
			success: true,
			statusCode: 200,
			message: "Otp sent successfully",
		};
	} catch (error) {
		console.error(
			"Failed to find user and sent otp Error At 'findUserAndSentOtp': ",
			error
		);
		return {
			success: false,
			statusCode: 500,
			message: "Unable to sent otp please try again",
		};
	}
};

/**
 * @param {string} credential - "credential to verify"
 * @param {string} type - "email/mobile"
 * @param {number} otp - "otp"
 * @return {Object} - response
 */

const verifyForgotPassOtp = async (credential, otp) => {
	try {
		//first check user
		const checkUser = await checkUserExistAndActive(credential);

		if (!checkUser.success) {
			return {
				success: false,
				statusCode: checkUser?.statusCode,
				message: checkUser?.message,
			};
		}

		//validate forgot passoword otp
		const validateOtpResponse = await validateOtp(
			"forgot-password",
			credential,
			otp
		);

		if (!validateOtpResponse?.success) {
			return {
				success: validateOtpResponse.success,
				statusCode: validateOtpResponse.statusCode,
				message: validateOtpResponse.message,
			};
		}

		//sent new otp
		const newOtp = await getNewOtp(credential, "forgot-password");

		//if error on generating otp
		if (!newOtp.success) {
			throw new Error(registrationOtpResponse.error);
		}

		return {
			success: validateOtpResponse.success,
			statusCode: validateOtpResponse.statusCode,
			message: validateOtpResponse.message,
			newOtp,
		};
	} catch (error) {
		console.error(
			"Forgot Password Otp Validation failed Error At 'validateForgotPassOtp': ",
			error
		);
		return {
			success: false,
			statusCode: 500,
			message: "Failed to verify otp please try again",
		};
	}
};

const changeUserPassword = async (credential, newPassword) => {
	try {
		//first check user
		const checkUser = await checkUserExistAndActive(credential);

		if (!checkUser.success) {
			return {
				success: false,
				statusCode: checkUser?.statusCode,
				message: checkUser?.message,
			};
		}

		//set new password of user
		const setNewPasswordResponse = await setNewPassword(
			credential,
			newPassword
		);

		if(!setNewPasswordResponse)
		{
			throw new Error("Failed to set password");
		}
		

		return {
			success: true,
			statusCode: 200,
			message: "User password updated successfully",
		};
	} catch (error) {
		console.error(
			"Failed to change user password Error At 'changeUserPassword': ",
			error
		);
		return {
			success: false,
			statusCode: 500,
			message: "Unable to change user password",
		};
	}
};

module.exports = {
	findUserWithCredential,
	getNewOtp,
	saveUserInDatabase,
	loginUser,
	generateAccessTokenViaRefreshToken,
	findUserAndSentOtp,
	verifyForgotPassOtp,
	changeUserPassword,
};
