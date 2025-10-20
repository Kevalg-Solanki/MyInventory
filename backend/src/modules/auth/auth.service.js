//external modules
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//models
const otpModel = require("../otp/otp.model");
const userModel = require("../user/user.model");

//utils
const { generateOtp } = require("../../utils/otpGenerator.js");
const validateOtp = require("../../utils/validateOtp.js");

/**
 * -find user with credential in database
 * @param {string} credential - credential with find user
 * @return {Object} - if user exist returns user info or if not then returns null
 */

const checkUserExistWithCredential = async (credential) => {
	//find and return user
	return await userModel.findOne({
		$or: [{ email: credential }, { mobile: credential }],
		isDeleted: false,
	});
};

const getRegistrationOtp = async (destination) => {
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
			type: "registration",
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
			"Registration otp generation failed Error At 'getRegistrationOtp': ",
			error
		);
		return {
			success: false,
			statusCode: 500,

			messages: "Failed to generate registration otp please try again",
		};
	}
};

/**
 *
 * @param {Object} userData - user data to save
 * @return {Object}- saved user data
 */
const saveUserInDatabase = async (userData) => {
	try {
		//hash password
		const hashedPassword = await bcrypt.hash(userData?.password, 10);

		//save user in database
		const userToSave = new userModel({
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
			messages: "Failed to register please try again",
		};
	}
};

module.exports = {
	checkUserExistWithCredential,
	getRegistrationOtp,
	saveUserInDatabase,
};
