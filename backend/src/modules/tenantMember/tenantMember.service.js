//constants
const { USER_ERROR, COMM_ERROR, REQUEST_TYPE, CRUD_ERROR, REQ_ERROR } = require("../../constants");
const { MESSAGE_TYPE } = require("../../constants/messageType.js");

//repository
const userRepo = require("../../repositories/user.repository.js");
const tenantRepo = require("../../repositories/tenant.repository.js");
const requestRepo = require("../../repositories/request.repository.js");

//utils
const throwAppError = require("../../utils/throwAppError");
const { sendSms } = require("../../utils/smsService.js");
const { sendMail } = require("../../utils/emailService.js");
const { createRequestByData } = require("../../repositories/request.repository.js");

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
 * @param {string} invitorUserData - invitor data 
 */
async function inviteUserToPlatformAndSendInviteRequest(
	tenantId,
	type,
	credential,
	invitorUserData
) {
	//Check user exist with credential
	const userInDatabase = await assertUserExistByCredential(credential);
	console.log(userInDatabase);
	if (userInDatabase) throwAppError(USER_ERROR.USER_EXISTS);

	
	const requestInDatabase = await requestRepo.fetchRequestByCombination(tenantId,credential)

	if(requestInDatabase) throwAppError(REQ_ERROR.REQUEST_ALREADY_SENT);

	//Send invitation on email/mobile
	const tenantData = await tenantRepo.fetchSelectedTenantFieldsById(tenantId,
							"_id tenantName tenantCategory ownerId street landmark city state country zip");

	//Get owner name by owner id in tenantData
	const ownerData = await userRepo.findUserById(tenantData?.ownerId);

	

	const payload = {
		invitorName: `${invitorUserData?.firstName} ${invitorUserData?.lastName}`,
	};

	if (type == "mobile")
    {
		await sendSms(MESSAGE_TYPE.PLATFORM_INVITE, credential, {payload});
    }
    else if(type=="email")
    {
        await sendMail(MESSAGE_TYPE.PLATFORM_INVITE, credential, {payload});
    }
	else
	{
		throwAppError(COMM_ERROR.UNSUPPORTED_CREDENTIAL_TYPE);
	}

	//Open the invite request for ther user to tenant
	const inviteRequestToSave = {
		senderId:invitorUserData._id,
		receiverCredential:credential,
		tenantId: tenantData?._id,
		requestType: REQUEST_TYPE.TENANT_INVITE_REQ.type,
		requestTitle: REQUEST_TYPE.TENANT_INVITE_REQ.title,
		requestMessage:REQUEST_TYPE.TENANT_INVITE_REQ.message
	}

	const savedRequestData = await createRequestByData(inviteRequestToSave);

	if(!savedRequestData) throwAppError(CRUD_ERROR.UNABLE_TO_SAVE);

	return;
}

module.exports = {
	inviteUserToPlatformAndSendInviteRequest,
};
