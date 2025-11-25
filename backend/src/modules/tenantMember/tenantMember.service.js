//constants
const { USER_ERROR, COMM_ERROR, REQUEST_TYPE } = require("../../constants");
const { MESSAGE_TYPE } = require("../../constants/type.js");

//repository
const userRepo = require("../../repositories/user.repository.js");
const tenantRepo = require("../../repositories/tenant.repository.js");

//utils
const throwAppError = require("../../utils/throwAppError");
const { sendSms } = require("../../utils/smsService.js");
const { sendMail } = require("../../utils/emailService.js");

//-- helper functins

/**
 *
 * @param {string} credential - email or mobile
 * @return {object} - null if not found
 */
async function assertUserExistByCredential(credential) {
	const userInDatabase = await userRepo.findUserByCredential(credential);

	if (!userInDatabase) return null;

	return userInDatabase;
}

//**Main service functions

/**
 *
 * @param {string} tenantId - id of tenant who send request
 * @param {string} type - credential type email/mobile
 * @param {string} credential - credential example@gmail.com
 */
async function inviteUserToPlatformAndSendTenantInviteRequest(
	tenantId,
	type,
	credential
) {
	//Check user exist with credential
	const userInDatabase = assertUserExistByCredential(credential);

	if (userInDatabase) throwAppError(USER_ERROR.USER_EXISTS);

	//Send invitation on email/mobile
	const tenantData = await tenantRepo.fetchSelectedTenantFieldsById(tenantId,
							"_id tenantName tenantCategory ownerId street landmark city state country zip");

	//Get owner name by owner id in tenantData
	const ownerData = await userRepo.findUserById(tenantData?.ownerId);

	const user = req.user;

	const payload = {
		invitorName: `${user?.firstName} ${user?.lastName}`,
		tenantName: tenantData?.tenantName,
		tenantCategory: tenantData?.tenantCategory,
		tenantAddress: `${tenantData?.street}, ${tenantData?.landmark}, ${tenantData?.city}, ${state}, ${country}, ${zip}`,
        tenantOwnerName:`${ownerData?.firstName,ownerData?.lastName}`
	};

	if (type == "mobile")
    {
		await sendSms(MESSAGE_TYPE.PLATFORM_AND_TENANT_INVITE, credential, {payload});
    }
    else if(type=="email")
    {
        await sendMail(MESSAGE_TYPE.PLATFORM_AND_TENANT_INVITE, credential, {payload});
    }
	else
	{
		throwAppError(COMM_ERROR.UNSUPPORTED_CREDENTIAL_TYPE);
	}


	//Open the invite request for ther user to tenant
	const inviteRequestToSave = {
		senderId:user._id,
		receiverCredential:credential,
		tenantId: tenantData?._id,
		requestType: REQUEST_TYPE.INVITE_TO_TENANT_REQUEST
		

		
	}

}

module.exports = {
	inviteUserToPlatformAndSendTenantInviteRequest,
};
