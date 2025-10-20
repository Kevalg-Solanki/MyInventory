//external modules
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

//models
const otpModel = require("../otp/otp.model");
const { UserModel, UserClass } = require("../user/user.model");

//utils
const { generateOtp } = require("../../utils/otpGenerator.js");
const { generateAccessToken, generateRefreshToken } = require("../../utils/jwtTokenService.js");

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

//login service
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

		//if password does not match
		if(!isMatched)
		{
			return {
				success:false,
				statusCode:401,
				message:"Password incorrect"
			}
		}

		//check user account is activate or not
		const isActive = user.isUserAccountActive();

		//if diactived user account
		if(!isActive)
		{
			return {
				success:false,
				statusCode:403,
				message:"Your account is deactivated. Please activate it using the email sent to you."
			}
		}

		//if active 
		//create access and refresh token
		const payload = await user.getUserInfo();
		
		//generate access and refresh token
		const accessToken = generateAccessToken(payload);
		const refreshToken = generateRefreshToken(payload);


		//return user info and token
		return {
			success:true,
			statusCode:200,
			data:{...payload},
			accessToken,
			refreshToken
		}

	} catch (error) {
		console.error("Login failed Error At 'loginUser': ", error);

		return {
			success: false,
			statusCode: 500,
			message: "Unable to login please try again",
		};
	}
};

module.exports = {
	findUserWithCredential,
	getRegistrationOtp,
	saveUserInDatabase,
	loginUser
};
