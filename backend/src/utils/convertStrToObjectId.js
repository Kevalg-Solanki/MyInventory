const { ObjectId } = require("mongodb");

/**
 *
 * @param {string} strId - id as string to convert
 * @returns {ObjectId} - converted ObjectId
 */
module.exports = async function convertStrToObjectId(strId) {
	if (!ObjectId.isValid(strId)) {
		throwAppError(GLOBAL_ERROR.OBJECTID_INVALID);
	}
	return new ObjectId(strId);
};
