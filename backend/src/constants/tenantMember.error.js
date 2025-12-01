
module.exports = {
	//

    //--403
	MEMBER_DEACTIVATED: {
		code: "MEMBER_DEACTIVATED",
		httpStatus: 403,
		message:
			"Your member account is deactivated in this tenant. Please your tenant.",
	},

	//--404
	MEMBER_NOT_FOUND: {
		code: "MEMBER_NOT_FOUND",
		httpStatus: 404,
		message: "Member not found.",
	},

	//--409
	ALREADY_TENANT_MEMBER:{
		code:"ALREADY_TENANT_MEMBER",
		httpStatus:409,
		message:"User is already member of this tenant."
	}
}