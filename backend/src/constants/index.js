//Centralized error constant exporter/barrel
//only import and export

module.exports = {
	//--ERRORS

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

	//tenant.error.js
	TENANT_ERROR: require("./tenant.error"),

	//tenantRole.error.js
	ROLE_ERROR: require("./tenantRole.error"),

	//tenantMember.error.js
	MEMBER_ERROR:require("./tenantMember.error"),

	//communication.error.js
	COMM_ERROR: require("./comms.error"),

	//--TYPES

	//requestTypes.js
	REQUEST_TYPE: require("./requestTypes");
};
