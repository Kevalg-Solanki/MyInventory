//constants
const {
	USER_ERROR,
	COMM_ERROR,
	REQUEST_TYPE,
	CRUD_ERROR,
	REQ_ERROR,
	MEMBER_ERROR,
} = require("../../constants");
const { MESSAGE_TYPE } = require("../../constants/messageType.js");

//repository
const userRepo = require("../../repositories/user.repository.js");
const tenantRepo = require("../../repositories/tenant.repository.js");
const requestRepo = require("../../repositories/request.repository.js");
const memberRepo = require("../../repositories/tenantMember.repository.js");

//utils
const throwAppError = require("../../utils/throwAppError");
const { sendSms } = require("../../utils/smsService.js");
const { sendMail } = require("../../utils/emailService.js");
const replaceAllKeywordWithValue = require("../../utils/replaceAllKeywordWithValue.js");



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

	const requestInDatabase = await requestRepo.fetchRequestByCombination(
		tenantId,
		credential
	);

	if (requestInDatabase) throwAppError(REQ_ERROR.REQUEST_ALREADY_SENT);

	//Send invitation on email/mobile
	const tenantData = await tenantRepo.fetchSelectedTenantFieldsById(
		tenantId,
		"_id tenantName tenantCategory ownerId street landmark city state country zip"
	);

	//Get owner name by owner id in tenantData
	console.log(invitorUserData);
	const payload = {
		invitorName: `${invitorUserData?.firstName} ${invitorUserData?.lastName}`,
	};

	console.log(payload);

	if (type == "mobile") {
		await sendSms(MESSAGE_TYPE.PLATFORM_INVITE, credential, payload);
	} else if (type == "email") {
		await sendMail(MESSAGE_TYPE.PLATFORM_INVITE, credential, payload);
	} else {
		throwAppError(COMM_ERROR.UNSUPPORTED_CREDENTIAL_TYPE);
	}

	//Open the invite request for ther user to tenant

	//replace keyword
	let reqMessage = replaceAllKeywordWithValue(
		REQUEST_TYPE.TENANT_INVITE_REQ.message,
		{
			"[[tenantName]]": tenantData?.tenantName,
			"[[invitorName]]": payload?.invitorName,
		}
	);
	const inviteRequestToSave = {
		senderId: invitorUserData._id,
		receiverCredential: credential,
		tenantId: tenantData?._id,
		requestType: REQUEST_TYPE.TENANT_INVITE_REQ.type,
		requestTitle: REQUEST_TYPE.TENANT_INVITE_REQ.title,
		requestMessage: reqMessage,
	};

	const savedRequestData = await requestRepo.createRequestByData(
		inviteRequestToSave
	);

	if (!savedRequestData) throwAppError(CRUD_ERROR.UNABLE_TO_SAVE);

	return;
}

/**
 *
 * @param {string} tenantId - id of tenant who send request
 * @param {string} type - credential type email/mobile
 * @param {string} credential - credential example@gmail.com
 * @param {object} invitorUserData - invitor data
 */
async function sendUserJoinTenantRequest(
	tenantId,
	type,
	credential,
	invitorUserData
) {
	//1. Check user exist with credential
	const userInDatabase = await assertUserExistByCredential(credential);
	if (!userInDatabase) throwAppError(USER_ERROR.USER_NOT_FOUND);
	if(userInDatabase && !userInDatabase.isActive) throwAppError(USER_ERROR.USER_DEACTIVATED);

	//2. check user is not already member of the tenant
	const isTenantMember = await memberRepo.findTenantMemberByIds(tenantId,userInDatabase?._id);
	if(isTenantMember) throwAppError(MEMBER_ERROR.ALREADY_TENANT_MEMBER);

	//3. check request is not sent alread.
	const requestInDatabase = await requestRepo.fetchRequestByCombination(
		tenantId,
		credential
	);

	if (requestInDatabase) throwAppError(REQ_ERROR.REQUEST_ALREADY_SENT);

	//4. Send invitation on email/mobile
	const tenantData = await tenantRepo.fetchSelectedTenantFieldsById(
		tenantId,
		"_id tenantName tenantCategory ownerId street landmark city state country zip"
	);

	
	//Get owner name by owner id in tenantData
	const ownerData = await userRepo.findUserById(tenantData?.ownerId);

	const payload = {
		invitorName: `${invitorUserData?.firstName} ${invitorUserData?.lastName}`,
		tenantOwnerName: `${ownerData?.firstName} ${ownerData?.lastName}`,
		tenantAddress: `${tenantData?.street}, ${tenantData?.landmark}, ${tenantData?.city}, ${tenantData?.state}, ${tenantData?.country}, ${tenantData?.zip}`,
	};

	if (type == "mobile") {
		await sendSms(MESSAGE_TYPE.TENANT_INVITE, credential, payload);
	} else if (type == "email") {
		await sendMail(MESSAGE_TYPE.TENANT_INVITE, credential, payload);
	} else {
		throwAppError(COMM_ERROR.UNSUPPORTED_CREDENTIAL_TYPE);
	}

	//5. Open the invite request for the user to tenant

	//replace keyword
	let reqMessage = replaceAllKeywordWithValue(
		REQUEST_TYPE.TENANT_INVITE_REQ.message,
		{
			"[[tenantName]]": tenantData?.tenantName,
			"[[invitorName]]": payload?.invitorName,
		}
	);

	const inviteRequestToSave = {
		senderId: invitorUserData._id,
		receiverId: userInDatabase?._id,
		receiverCredential: credential,
		tenantId: tenantData?._id,
		requestType: REQUEST_TYPE.TENANT_INVITE_REQ.type,
		requestTitle: REQUEST_TYPE.TENANT_INVITE_REQ.title,
		requestMessage: reqMessage,
	};

	const savedRequestData = await requestRepo.createRequestByData(
		inviteRequestToSave
	);

	if (!savedRequestData) throwAppError(CRUD_ERROR.UNABLE_TO_SAVE);

	return;
}

// GET /:tenantId
async function getAllTenantMemberListWithRoles(pagination,)
{

}

module.exports = {
	inviteUserToPlatformAndSendInviteRequest,
	sendUserJoinTenantRequest,
};
