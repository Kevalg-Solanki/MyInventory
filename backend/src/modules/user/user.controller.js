//services
const { updateUserProfile,deactivateUserAndNotifyUser,  updateSettings } = require("./user.service");

//utils
const sendResponse = require("../../utils/sendResponse");


//users/:userId PATCH
async function updateUser(req, res, next) {
	try {
		const { userId } = req.params;
		const updatedUserData = req.body;

		await updateUserProfile(userId, req.body);

		return sendResponse(res, 200, "User updated successfully.");
	} catch (error) {
		next(error);
	}
}

//users/deactivate/:userId PATCH
async function deactivateUser(req, res, next) {
	try {
		const {userId} = req.params;

		await deactivateUserAndNotifyUser(userId);

		return sendResponse(res,200,"Deactivation successfully.");

	} catch (error) {
		next(error);
	}
}

//users/:userId/settings
async function updateUserSettings(req,res,next){
	try
	{
		const {userId} = req.params;
		const updatedSettings = req.body;

		const savedSettings = await updateSettings(userId,updatedSettings);

		return sendResponse(res,200,"Settings saved!",{savedSettings})
	}
	catch(error)
	{
		next(error);
	}
}

module.exports = {
	updateUser,
	deactivateUser,
	updateUserSettings
};
