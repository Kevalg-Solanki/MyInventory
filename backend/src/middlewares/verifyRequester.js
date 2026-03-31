//constants
const { ID_ERROR, USER_ERROR, AUTH_ERROR } = require("../constants");

//utils
const { isValidObjectId } = require("../utils");
const throwAppError = require("../utils/throwAppError");

//verify via userId passed in params and _id from token
async function verifyIsSelf(req, res, next) {
	//single function for throwing error insted of repeating longer syntax
	const throwError = (error) => next(throwAppError(error));

	try {
		const { userId } = req.params;


		if (!userId) return throwError(USER_ERROR.USER_NOT_FOUND);

		if (!isValidObjectId(userId)) return throwError(ID_ERROR.OBJECTID_INVALID);

		if (!req.user._id.equals(userId))
			return throwError(AUTH_ERROR.ACCESS_DENIED);


        next();
	} catch (error) {
		return next(error);
	}
}

module.exports = {
	verifyIsSelf,
};
