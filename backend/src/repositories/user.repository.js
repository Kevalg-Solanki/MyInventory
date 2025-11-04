//models
const { UserModel } = require("../modules/user/user.model");



/**
 * -find user with id in database
 * @param {string} userId - id with find user
 * @return {Object} - if user exist returns user info or if not then returns null
 */

async function findUserById(userId) {
	return await UserModel.findOne({ _id: userId, isDeleted: false });
}

/**
 * -find user with credential in database
 * @param {string} credential - credential with find user
 * @return {Object} - if user exist returns user info or if not then returns null
 */

async function findUserByCredential(credential) {
	//find and return user
	return await UserModel.findOne({
		$or: [{ email: credential }, { mobile: credential }],
		isDeleted: false,
	});
}


async function updateUserById(userId,updatedUserData){
	return await UserModel.findOneAndUpdate(
			{ _id: userId, isDeleted: false, isActive: true },
			{ $set: updatedUserData },
			{ new: true }
		);
}


module.exports = {
    findUserById,
    findUserByCredential,
	updateUserById
}