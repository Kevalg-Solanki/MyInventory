//external modules
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//constants
const { PASS_ERROR, TOKEN_ERROR, USER_ERROR } = require("../../constants");
const { OTP_TYPE, SESSION_OTP_TYPE } = require("../../constants/type.js");

//models
const otpModel = require("../otp/otp.model");
const { UserModel, UserClass } = require("../user/user.model");

//repositories
const {findUserById,findUserByCredential} = require("../../repositories/user.repository.js");


//utils
const { generateOtp } = require("../../utils/otpGenerator.js");
const {
	generateAccessToken,
	generateRefreshToken,
} = require("../../utils/jwtTokenService.js");
const { sendOtp } = require("../otp/otp.service.js");
const validateOtp = require("../../utils/validateOtp.js");
const throwAppError = require("../../utils/throwAppError.js");


/**
 *
 * @param {string} credential - email/mobile
 * @returns {Object}
 */
async function assertUserExistAndActiveByCredential(credential) {
	const userInDatabase = await findUserByCredential(credential);

	if (!userInDatabase) {
		throwAppError(USER_ERROR.USER_NOT_FOUND);
	}

	const user = new UserClass(userInDatabase);

	//check user active
	if (!user.isUserAccountActive()) {
		throwAppError(USER_ERROR.USER_DEACTIVATED);
	}

	return userInDatabase;
}

/**
 *
 * @param {string} userId - userId
 * @returns {Object}
 */
async function assertUseExistAndActiveById(userId) {
	const userInDatabase = await findUserById(userId);

	if (!userInDatabase) {
		throwAppError(USER_ERROR.USER_NOT_FOUND);
	}

	const user = new UserClass(userInDatabase);

	//check user active
	if (!user.isUserAccountActive()) {
		throwAppError(USER_ERROR.USER_DEACTIVATED);
	}

	return userInDatabase;
}

/**
 * -find user with credential in database
 * @param {string} destination - email/mobile of user who trying to register
 * @param {string} type - type of otp
 * @return {Object} - returns newOtp
 */
async function getNewOtp(destination, type) {
	//generate new otp for registration
	//clear all existing otp for user first
	await otpModel.deleteMany({
		destination,
	});

	//generate otp
	const newOtp = await generateOtp();

	//set expiry time
	const newExpireIn = Date.now() + process.env.REGISTER_OTP_EXPIRY * 60 * 1000; //expire in min

	//save otp to database
	const otpToSaveInDatabase = new otpModel({
		type: type,
		destination,
		otp: newOtp,
		expireIn: newExpireIn,
	});

	//save to database
	await otpToSaveInDatabase.save();

	return newOtp;
}

/**
 *
 * @param {string} credential - email/mobile of user
 * @param {string} newPassword - new hashed password
 * @returns {Object} - response
 */
async function setNewPassword(credential, newPassword) {
	//hash password
	const hashedPassword = await bcrypt.hash(
		newPassword,
		Number(process.env.HASH_COST_FACTOR)
	);
	//set new password
	const updatedUser = await UserModel.findOneAndUpdate(
		{ $or: [{ email: credential }, { mobile: credential }] },
		{ $set: { password: hashedPassword } },
		{ new: true, runValidators: true }
	);

	return updatedUser;
}

/**
 * @param {ObjectId} userId - userId for finding user
 * @param {string} newPassword - new password to set
 * @return {Object} - updated user
 */
async function setNewPasswordById(userId, newPassword) {
	//hash password
	const hashedPassword = await bcrypt.hash(
		newPassword,
		Number(process.env.HASH_COST_FACTOR)
	);
	//set new password
	const updatedUser = await UserModel.findOneAndUpdate(
		{ _id: userId },
		{ $set: { password: hashedPassword } },
		{ new: true, runValidators: true }
	);

	return updatedUser;
}

/**
 *
 * @param {Object} userData - user data to save
 * @return {Object}- saved user data
 */
async function saveUserInDatabase(userData) {
	//1.hash password
	const hashedPassword = await bcrypt.hash(
		userData?.password,
		Number(process.env.HASH_COST_FACTOR)
	);

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

	return savedUser;
}

/**
 * @param {string} credential - actual email/mobile
 * @param {string} type - "email" or "mobile"
 */
async function assertUserDoesNotExistByCredential(credential) {
	//check if user exist
	const existingUserInDatabase = await findUserByCredential(credential);

	//if user exist in data base then throw error
	if (existingUserInDatabase) {
		throwAppError(USER_ERROR.USER_EXISTS);
	}

	//if user does not exist return
}

/**
 *
 * @param {string} credential
 * @param {string} type
 * @returns
 */

async function sendVericationOtp(credential, type) {
	try {
		//send otp on the email/mobile.
		const sendOtpResult = await sendOtp(
			OTP_TYPE.VERIFY_CREDENTIAL,
			type,
			credential,
			process.env.VERIFY_CRED_OTP_EXPIRY
		);

		//if failed to sent otp
		if (!sendOtpResult) {
			throwAppError(COMM_ERROR.EMAIL_SEND_FAILED);
		}

		//if otp sent return
	} catch (error) {
		throw error;
	}
}

async function getUserRegistrationRequiredData(savedUser) {
	const user = new UserClass(savedUser);

	const payload = await user.getUserInfo();

	const accessToken = generateAccessToken(payload);
	const refreshToken = generateRefreshToken(payload);

	return { accessToken, refreshToken, userData: payload };
}

/**
 *
 * @param {Object} userData - user data recieved in request
 * @returns - userDetails from database and tokens
 */
async function loginUser(userData) {
	//1. find user in database
	const userInDatabase = await findUserByCredential(userData.credential);

	//if user does not exist
	if (!userInDatabase) {
		throwAppError(USER_ERROR.USER_NOT_FOUND);
	}

	//2. Create object of user
	const user = new UserClass(userInDatabase);

	//3. Verify user password
	const isMatched = await user.verifyPassword(userData.password);

	//if password does not match
	if (!isMatched) {
		throwAppError(PASS_ERROR.PASSWORD_INCORRECT);
	}

	//check user account is activate or not
	const isActive = await user.isUserAccountActive();

	//if diactived user account
	if (!isActive) {
		throwAppError(USER_ERROR.USER_DEACTIVATED);
	}

	//if active
	//create access and refresh token
	const payload = await user.getUserInfo();

	//generate access and refresh token
	const accessToken = generateAccessToken(payload);
	const refreshToken = generateRefreshToken(payload);

	//return user info and token
	return {
		userData: { ...payload },
		accessToken,
		refreshToken,
	};
}

/**
 * @param {string} refreshToken - refresh token came in request with which new access token will generated
 * @return {Object} - new access token
 */
async function generateAccessTokenViaRefreshToken(refreshToken) {
	try {
		//check refreshToken exist
		if (!refreshToken) {
			throwAppError(TOKEN_ERROR.TOKEN_NOT_FOUND);
		}

		//verify and decod token
		const decoded = jwt.verify(refreshToken, process.env.JWT_SECRETE);

		//check if user exist and active
		const userDataFromDatabase = await assertUseExistAndActiveById(decoded._id);

		//create object of user class
		const user = new UserClass(userDataFromDatabase);

		//create payload
		const payload = await user.getUserInfo();

		//generate new access token
		const newAccessToken = generateAccessToken(payload);

		return newAccessToken;
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			throwAppError(TOKEN_ERROR.TOKEN_EXPIRED);
		} else if (error.name === "JsonWebTokenError") {
			throwAppError(TOKEN_ERROR.TOKEN_INVALID);
		}
		throw error;
	}
}

/**
 * @param {string} credential - example@gmail.com/999989898
 * @param {string} type - email/mobile
 * @return {Object} - response success/fail
 */

async function findUserAndSentOtp(credential, type) {
	try {
		//first check user
		await assertUserExistAndActiveByCredential(credential);

		//if user active then sent otp on credential
		await sendOtp(OTP_TYPE.FORGOT_PASSWORD, type, credential);

		//if sent otp return
	} catch (error) {
		throw error;
	}
}

/**
 * @param {string} credential - "credential to verify"
 * @param {string} type - "email/mobile"
 * @param {number} otp - "otp"
 * @return {Object} - response
 */

async function verifyForgotPassOtp(credential, otp) {
	//first check user
	await assertUserExistAndActiveByCredential(credential);

	//validate forgot passoword otp
	await validateOtp(OTP_TYPE.FORGOT_PASSWORD, credential, otp);

	//sent new otp
	const newOtp = await getNewOtp(credential, SESSION_OTP_TYPE.FORGOT_PASSWORD);

	return newOtp;
}

/**
 *
 * @param {string} credential - email/mobile
 * @param {string} newPassword - new password to set
 * @returns
 */
async function changeUserPassword(credential, newPassword) {
	try {
		//first check user
		await assertUserExistAndActiveByCredential(credential);

		//set new password of user
		const setNewPasswordResponse = await setNewPassword(
			credential,
			newPassword
		);

		if (!setNewPasswordResponse) {
			throwAppError(PASS_ERROR.PASSWORD_RESET_FAILED);
		}

		return;
	} catch (error) {
		throw error;
	}
}

async function verifyOldPassAndSetNewPass(user, oldPassword, newPassword) {
	//check old password match
	const isMatched = await user.verifyPassword(oldPassword);

	//if password does not match
	if (!isMatched) {
		throwAppError(PASS_ERROR.PASSWORD_INCORRECT);
	}

	const userData = await user.getUserInfo();
	//if password matches change password
	//set new password of user
	const updatedUser = await setNewPasswordById(userData._id, newPassword);

	//if password changed return
	return;
}

module.exports = {
	findUserByCredential,
	assertUserDoesNotExistByCredential,
	sendVericationOtp,
	getNewOtp,
	saveUserInDatabase,
	getUserRegistrationRequiredData,
	loginUser,
	generateAccessTokenViaRefreshToken,
	findUserAndSentOtp,
	verifyForgotPassOtp,
	changeUserPassword,
	findUserById,
	assertUseExistAndActiveById,
	verifyOldPassAndSetNewPass,
};
