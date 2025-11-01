//External modules
const jwt = require("jsonwebtoken");

//models
const { UserModel } = require("../modules/user/user.model");

//constants
const { TOKEN_ERROR, USER_ERROR, ID_ERROR } = require("../constants");

//utils
const throwAppError = require("../utils/throwAppError");
const { isValidObjectId } = require("mongoose");

async function verifyToken(req, res, next){
	const throwError = (error) => next(throwAppError(error));
	try {
		//get token
		const authToken = req.header("Authorization");

		//check token exist
		if (!authToken || !authToken.startsWith("Bearer "))
			return throwError(TOKEN_ERROR.TOKEN_NOT_FOUND);

		//get token part only
		const token = authToken.split(" ")[1];
		//verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRETE);

		//check id
		if(!isValidObjectId(decoded._id)) return throwError(ID_ERROR.OBJECTID_INVALID);

		//check if user exist
		req.user = await UserModel.findById(decoded._id).select("-password -__v"); //exclude password field to fetch

		//if user not exist
		if (!req.user || req.user?.isDeleted)
			return throwError(USER_ERROR.USER_NOT_FOUND);

		//check user is active or not
		if (!req.user?.isActive) return throwError(USER_ERROR.USER_DEACTIVATED);

		//if token valid
		return next();
	} catch (error) {
		if (error?.name === "TokenExpiredError")
			return throwError(TOKEN_ERROR.TOKEN_EXPIRED);

		if (error?.name === "JsonWebTokenError") return throwError(TOKEN_ERROR.TOKEN_INVALID);

		return next(error);
	}
};

module.exports = verifyToken;
