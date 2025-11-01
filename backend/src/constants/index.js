//Centralized error constant exporter/barrel
//only import and export

module.exports = {
	//auth.error.js
	AUTH_ERROR: require("./auth.error").AUTH,
	ID_ERROR: require("./auth.error").ID,
	PASS_ERROR: require("./auth.error").PASS,
	TOKEN_ERROR: require("./auth.error").TOKEN,
	OTP_ERROR: require("./auth.error").OTP,

	//crud.error.js
	CRUD_ERROR: require("./crud.errors"),

	//user.error.js
	USER_ERROR: require("./user.error"),

	//tenant.error
	TENANT_ERROR: require("./tenant.error"),

	//communication.error.js
	COMM_ERROR: require("./comms.error"),
};
