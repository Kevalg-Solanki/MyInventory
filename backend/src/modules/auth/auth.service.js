//external modules
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//constants
const ERROR = require("../../constants/errors.js");
const { OTP_TYPE, SESSION_OTP_TYPE } = require("../../constants/auth.js");

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
const AppError = require("../../utils/appErrorHandler.js");
const sendResponse = require("../../utils/sendResponse.js");

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
 * -find user with id in database
 * @param {string} credential - id with find user
 * @return {Object} - if user exist returns user info or if not then returns null
 */

const findUserWithId = async (userId) => {
	return await UserModel.findOne({ _id: userId, isDeleted: false });
};

/**
 *
 * @param {string} credential - email/mobile
 * @returns {Object}
 */
const checkUserExistAndActive = async (credential) => {
	const userInDatabase = await findUserWithCredential(credential);

	if (!userInDatabase) {
		let error = ERROR.USER_NOT_FOUND;
		throw new AppError(error?.message, error?.code, error?.httpStatus);
	}

	const user = new UserClass(userInDatabase);

	//check user active
	if (!user.isUserAccountActive()) {
		let error = ERROR.USER_DEACTIVATED;
		throw new AppError(error?.message, error?.code, error?.httpStatus);
	}

	return userInDatabase;
};

/**
 *
 * @param {string} userId - userId
 * @returns {Object}
 */
const checkUserWithIdExistAndActive = async (userId) => {
	const userInDatabase = await findUserWithId(userId);

	if (!userInDatabase) {
		let error = ERROR.USER_NOT_FOUND;
		throw new AppError(error?.message, error?.code, error?.httpStatus);
	}

	const user = new UserClass(userInDatabase);

	//check user active
	if (!user.isUserAccountActive()) {
		let error = ERROR.USER_DEACTIVATED;
		throw new AppError(error?.message, error?.code, error?.httpStatus);
	}

	return userInDatabase;
};

/**
 * -find user with credential in database
 * @param {string} destination - email/mobile of user who trying to register
 * @param {string} type - type of otp
 * @return {Object} - returns newOtp
 */
const getNewOtp = async (destination, type) => {
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
	//set new password
	const updatedUser = await UserModel.findOneAndUpdate(
		{ $or: [{ email: credential }, { mobile: credential }] },
		{ $set: { password: hashedPassword } },
		{ new: true, runValidators: true }
	);

	return updatedUser;
};

/**
 * @param {ObjectId} userId - userId for finding user
 * @param {string} newPassword - new password to set
 * @return {Object} - updated user
 */
const setNewPasswordWithId = async (userId, newPassword) => {
	console.log("user",newPassword)
	//hash password
	const hashedPassword = await bcrypt.hash(newPassword, 10);
	//set new password
	const updatedUser = await UserModel.findOneAndUpdate(
		{ _id: userId },
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

	return savedUser;
};

/**
 * @param {string} credential - actual email/mobile
 * @param {string} type - "email" or "mobile"
 */
const checkUserExist = async (credential) => {
	//check if user exist
	const existingUserInDatabase = await findUserWithCredential(credential);

	//if user exist in data base then throw error
	if (existingUserInDatabase) {
		let error = ERROR.USER_EXISTS;
		throw new AppError(error?.message, error?.code, error?.httpStatus);
	}

	//if user does not exist return
};

/**
 *
 * @param {string} credential
 * @param {string} type
 * @returns
 */

const sendVericationOtp = async (credential, type) => {
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
			let error = ERROR.EMAIL_SEND_FAILED;
			throw new AppError(error?.message, error?.code, error?.httpStatus);
		}

		//if otp sent return
	} catch (error) {
		throw error;
	}
};

/**
 *
 * @param {Object} userData - user data recieved in request
 * @returns - userDetails from database and tokens
 */
const loginUser = async (userData) => {
	//1. find user in database
	const userInDatabase = await findUserWithCredential(userData.credential);

	//if user does not exist
	if (!userInDatabase) {
		let error = ERROR.USER_NOT_FOUND;
		throw new AppError(error?.message, error?.code, error?.httpStatus);
	}

	//2. Create object of user
	const user = new UserClass(userInDatabase);

	//3. Verify user password
	const isMatched = await user.verifyPassword(userData.password);

	//if password does not match
	if (!isMatched) {
		let error = ERROR.PASSWORD_INCORRECT;
		throw new AppError(error?.message, error?.code, error?.httpStatus);
	}

	//check user account is activate or not
	const isActive = await user.isUserAccountActive();

	//if diactived user account
	if (!isActive) {
		let error = ERROR.USER_DEACTIVATED;
		throw new AppError(error?.message, error?.code, error?.httpStatus);
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
};

/**
 * @param {string} refreshToken - refresh token came in request with which new access token will generated
 * @return {Object} - new access token
 */
const generateAccessTokenViaRefreshToken = async (refreshToken) => {
	try {
		//check refreshToken exist
		if (!refreshToken) {
			let error = ERROR.TOKEN_NOT_FOUND;
			throw new AppError(error?.message, error?.code, error?.httpStatus);
		}

		//verify and decod token
		const decoded = jwt.verify(refreshToken, process.env.JWT_SECRETE);

		//check if user exist and active
		const userDataFromDatabase = await UserModel.findById(decoded._id);

		//if user not found
		if (!userDataFromDatabase || userDataFromDatabase.isDeleted) {
			let error = ERROR.USER_NOT_FOUND;
			throw new AppError(error?.message, error?.code, error?.httpStatus);
		}

		//check if user active
		if (!userDataFromDatabase.isActive) {
			let error = ERROR.USER_DEACTIVATED;
			throw new AppError(error?.message, error?.code, error?.httpStatus);
		}

		//create object of user class
		const user = new UserClass(userDataFromDatabase);

		//create payload
		const payload = await user.getUserInfo();

		//generate new access token
		const newAccessToken = generateAccessToken(payload);

		return newAccessToken;
	} catch (error) {
		if (error.name === "TokenExpiredError") {
			let err = ERROR.TOKEN_EXPIRED;
			throw new AppError(err?.message, err?.code, err?.httpStatus);
		}
		else if(error.name ==="JsonWebTokenError")
		{
			let err = ERROR.TOKEN_INVALID;
			throw new AppError(err?.message, err?.code, err?.httpStatus);
		}
		throw error;
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
		await checkUserExistAndActive(credential);

		//if user active then sent otp on credential
		await sendOtp(OTP_TYPE.FORGOT_PASSWORD, type, credential);

		//if sent otp return
	} catch (error) {
		throw error;
	}
};

/**
 * @param {string} credential - "credential to verify"
 * @param {string} type - "email/mobile"
 * @param {number} otp - "otp"
 * @return {Object} - response
 */

const verifyForgotPassOtp = async (credential, otp) => {
	//first check user
	await checkUserExistAndActive(credential);

	//validate forgot passoword otp
	await validateOtp(OTP_TYPE.FORGOT_PASSWORD, credential, otp);

	//sent new otp
	const newOtp = await getNewOtp(credential, SESSION_OTP_TYPE.FORGOT_PASSWORD);

	return newOtp;
};

/**
 *
 * @param {string} credential - email/mobile
 * @param {string} newPassword - new password to set
 * @returns
 */
const changeUserPassword = async (credential, newPassword) => {
	try {
		//first check user
		await checkUserExistAndActive(credential);

		//set new password of user
		const setNewPasswordResponse = await setNewPassword(
			credential,
			newPassword
		);

		if (!setNewPasswordResponse) {
			let error = ERROR.PASSWORD_RESET_FAILED;
			throw new AppError(error?.message, error?.code, error?.httpStatus);
		}

		return;
	} catch (error) {
		throw error;
	}
};

const resetUserPassword = async (user, oldPassword, newPassword) => {
	//check old password match
	const isMatched = await user.verifyPassword(oldPassword);
	console.log("user", user.getUserInfo())
	console.log(oldPassword,newPassword);
	console.log("is match",isMatched)
	//if password does not match
	if (!isMatched) {
		let error = ERROR.PASSWORD_INCORRECT;
		throw new AppError(error?.message, error?.code, error?.httpStatus);
	}

	const userData = await user.getUserInfo();
	//if password matches change password
	//set new password of user
	const updatedUser = await setNewPasswordWithId(userData._id,newPassword);

	//if password changed return 
	return;
};

module.exports = {
	findUserWithCredential,
	checkUserExist,
	sendVericationOtp,
	getNewOtp,
	saveUserInDatabase,
	loginUser,
	generateAccessTokenViaRefreshToken,
	findUserAndSentOtp,
	verifyForgotPassOtp,
	changeUserPassword,
	findUserWithId,
	checkUserWithIdExistAndActive,
	resetUserPassword,
};
