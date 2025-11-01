const { ObjectId } = require("mongodb");
const { ID_ERROR } = require("../constants");

/**
 *
 * @param {string} strId - id as string to convert
 * @returns {ObjectId} - converted ObjectId
 */
module.exports = async function convertStrToObjectId(strId) {
	if (!ObjectId.isValid(strId)) {
		throwAppError(ID_ERROR.OBJECTID_INVALID);
	}
	return new ObjectId(strId);
};
