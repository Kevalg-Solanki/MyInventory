//constants
const { USER_ERROR } = require("../../constants");
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
	//check user exist with credential
	const userInDatabase = assertUserExistByCredential(credential);

	if (userInDatabase) throwAppError(USER_ERROR.USER_EXISTS);

	//send invitation on email/mobile

	const tenantData = await tenantRepo.fetchTenantDataById(tenantId);

	//finder owner name
	const ownerData = await userRepo.findUserById(tenantData?.ownerId);

	const user = req.user;

	const payload = {
		invitorName: `${user?.firstName} ${user?.lastName}`,
		tenantName: tenantData?.tenantName,
		tenantCategory: tenantData?.tenantCategory,
		tenantAddress: `${tenantData?.street}, ${tenantData?.landmark}, ${tenantData?.city}, ${state}, ${country}, ${zip}`,
        tenantOwnerName:`${tenantData?.firstName,tenantData?.lastName}`
	};
	if (type == "mobile")
    {
		await sendSms(MESSAGE_TYPE.PLATFORM_AND_TENANT_INVITE, credential, {payload});
    }
    else if(type=="email")
    {
        await sendMail(MESSAGE_TYPE.PLATFORM_AND_TENANT_INVITE, credential, {payload});
    }
}

module.exports = {
	inviteUserToPlatformAndSendTenantInviteRequest,
};
