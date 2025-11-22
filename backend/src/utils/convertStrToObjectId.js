//external modules
const { ObjectId } = require("mongodb");

//constants
const { ID_ERROR } = require("../constants");

//utils
const throwAppError = require("./throwAppError");

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
