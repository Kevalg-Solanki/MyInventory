//external modules
const {DateTime} = require("luxon")

//models
const { UserModel } = require("./user.model");

//constants
const { USER_ERROR } = require("../../constants");
const { MESSAGE_TYPE } = require("../../constants/type");

//repositories
const {
	findUserById,
	updateUserById,
} = require("../../repositories/user.repository");

//utils
const throwAppError = require("../../utils/throwAppError");
const { sendMail } = require("../../utils/emailService");

//users/:userId PATCH
async function updateUserProfile(userId, updatedUserData) {
	const allowedFields = new Set(["firstName", "lastName"]);

	//remove anyother fields
	const filteredData = Object.fromEntries(
		Object.entries(updatedUserData).filter(
			([k, v]) => allowedFields.has(k) && v !== undefined
		)
	);

	const savedUserData = await updateUserById(userId, filteredData);

	//if failed to update user
	if (!savedUserData) {
		throwAppError(USER_ERROR.USER_NOT_FOUND);
	}
}

//users/deactivate/:userId PATCH
async function deactivateUserAndNotifyUser(userId) {
    let userID = userId;
	try {

		//find and deactivate user
		const updatedUser = await UserModel.findOneAndUpdate(
			{ _id: userID, isDeleted: false, isActive: true },
			{ $set: { isActive: false } },
			{ new: true }
		);

		if (!updatedUser) {
			throwAppError(USER_ERROR.USER_NOT_FOUND);
		}

        const userData = updatedUser;

		const userId = userData?._id;
		const userName = `${userData?.firstName} ${userData?.lastName}`;
        const userEmail = userData?.email ? userData?.email:"-" ;
        const userMobile = userData?.mobile? userData?.mobile:"-";
		const actedByName = userName;
		const actedByEmail = userData?.email ? userData?.email : "-";
		const actedByMobile = userData?.mobile ? userData?.mobile : "-";
		const deactivatedAt = DateTime.now()
			.setZone("Asia/Kolkata")
			.toFormat("h:mm a MM/dd/yyyy");
		const reactivationWindowHours = "(No limit)";

		//notify owner for deactivations
		if (userData?.email) {
			await sendMail(MESSAGE_TYPE.USER_DEACTIVATED_MSG, userData?.email, {
				userName,
				userId,
                userEmail,
                userMobile,
				actedByName,
				actedByEmail,
				actedByMobile,
				deactivatedAt,
				reactivationWindowHours,
			});
		} else if (req?.user?.mobile) {
			await sendSms(MESSAGE_TYPE.USER_DEACTIVATED_MSG, userData?.mobile, {
			    userName,
			});
		}

		//notify user
	} catch (error) {
		throw error;
	}
}

module.exports = {
	updateUserProfile,
    deactivateUserAndNotifyUser
};
