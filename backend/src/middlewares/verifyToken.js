//External modules
const jwt = require("jsonwebtoken");

//constants
const ERROR = require("../constants/errors.js");
const { UserModel } = require("../modules/user/user.model");

const verifyToken = async (req, res, next) => {
	try {
		//get token
		const authToken = req.header("Authorization");

		//check token exist
		if (!authToken || !authToken.startsWith("Bearer ")) {
			let err = ERROR.TOKEN_NOT_FOUND;
			//if token not exist or wrong keyword
			return res.status(err?.httpStatus).json({
				success: false,
				statusCode: err.httpStatus,
				message: err.message,
				code: err?.code,
			});
		}

		//get token part only
		const token = authToken.split(" ")[1];

		//verify token
		const decoded = jwt.verify(token, process.env.JWT_SECRETE);

		//check if user exist
		req.user = await UserModel.findById(decoded._id).select("-password -__v"); //exclude password field to fetch

		//if user not exist
		if (!req.user || req.user?.isDeleted) {
			let err = ERROR.USER_NOT_FOUND;
			return res.status(err?.httpStatus).json({
				success: false,
				statusCode: err.httpStatus,
				message: err.message,
				code: err?.code,
			});
		}

		//check user is active or not
		if (!req.user?.isActive) {
			let err = ERROR.USER_DEACTIVATED;
			return res.status(err?.httpStatus).json({
				success: false,
				statusCode: err.httpStatus,
				message: err.message,
				code: err?.code,
			});
		}

		//if token valid
		next();
	} catch (error) {
		console.error(error);
		if (error?.name === "JsonWebTokenError") {
			let err = ERROR.TOKEN_INVALID;
			return res.status(err?.httpStatus).json({
				success: false,
				statusCode: err.httpStatus,
				message: err.message,
				code: err?.code,
			});
		}

		return res.status(500).json({
			success: false,
			statusCode: 500,
			message: "Internal Server Error",
		});
	}
};

module.exports = verifyToken;
