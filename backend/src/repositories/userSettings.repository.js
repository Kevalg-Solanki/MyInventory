const UserSettingModel = require("../modules/settings/userSettings.model");
const { convertStrToObjectId } = require("../utils");


/**
 * 
 * @param {String} userId - user id whos's setting is to update
 * @param {Object} updatedUserSettings - updated user settings 
 * @returns {Object}
 */

async function updateUserSettings(userId,updatedUserSettings){  
    const convertedUserId = await convertStrToObjectId(userId);
    console.log(convertedUserId)
    return await UserSettingModel.findOneAndUpdate(
        {userId:userId},
        {$set: updatedUserSettings},
        {new:true,runValidators:true}
    )
}


module.exports = {
    updateUserSettings
}