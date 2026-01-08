//constants
const { REQ_ERROR, TENANT_ERROR, CRUD_ERROR } = require("../../constants");

//repositories
const tenantRepo = require("../../repositories/tenant.repository");
const requestRepo = require("../../repositories/request.repository");
const memberRepo = require("../../repositories/tenantMember.repository");
const userRepo = require("../../repositories/user.repository");

//utils
const prepareProperDataForPagination = require("../../utils/prepareProperDataForPagination");
const throwAppError = require("../../utils/throwAppError");
const { default: mongoose } = require("mongoose");

//--Helper functions

/**
 *
 * @param {object} requestData - request which is featched by requestId
 * @param {string} userCredential - email/mobile user loged in with
 * @return {void || never}
 */
async function validateReqUpdater(requestData, valueToValidate) {
	//validate it is user request or not
	if (
		requestData.receiverCredential != valueToValidate &&
		requestData.senderId != valueToValidate
	)
		throwAppError(REQ_ERROR.REQUEST_NOT_FOUND);

	
	console.log(requestData);
	return;
}

/**
 *
 * @param {object} requestData - request which is featched by requestId
 * @return {void || never}
 */
async function validateReqStatus(requestData) {
	const statusErrors = {
		cancelled: REQ_ERROR.REQUEST_ALREADY_CANCELLED,
		rejected: REQ_ERROR.REQUEST_ALREADY_REJECTED,
		accepted: REQ_ERROR.REQUEST_ALREADY_ACCEPTED,
	};

	//request active or not
	if (!requestData.isActive) {
		const error = statusErrors[requestData.requestStatus];
		if (error) throwAppError(error);
	}

	return;
}

/**
 *
 * @param {stirng || objectId} tenantId - id of tenant to check status
 * @returns {error || void}
 */
async function checkTenantStatus(tenantId) {
	//tenant status/ tenant exist/not deleted
	const tenantStatus = await tenantRepo.fetchTenantStatusById(tenantId);

	if (!tenantStatus) throwAppError(TENANT_ERROR.TENANT_NOT_FOUND);

	//is deactivated
	if (!tenantStatus.isActive) throwAppError(TENANT_ERROR.TENANT_DEACTIVATED);

	return;
}

/**
 *
 * @param {object} userData - user data which have userId,first and last name of user
 * @param {objectId} tenantId - tenantId to make user member of
 * @param {mongooseSession} session
 * @returns
 */
async function createTenantMembershipForUser(
	userData,
	tenantId,
	session = null
) {
	const memberData = {
		userId: userData._id,
		tenantId: tenantId,
		nickName: `${userData?.firstName} ${userData?.lastName}`,
	};

	return await memberRepo.createTenantMemberFromData(memberData, session);
}

//**Main services */

/**
 *
 * @param {string} userCredential - email/mobile of user to find request for
 * @param {object} pagination - {page:number,limit:number,sort:object}
 * @return {object} - throw error if something is wrong
 */
async function getActiveRequestsOfUser(userCredential, pagination) {
	const { data, totalNumberOfDocs } =
		await requestRepo.fetchAllActiveRequestByReceiverCredential(
			userCredential,
			pagination
		);

	let preparedPagination = prepareProperDataForPagination(
		pagination,
		totalNumberOfDocs
	);

	return { activeRequests: data, preparedPagination };
}

// /:requestId/accept
/**
 *
 * @param {string || objectId} requestId - request id to accept
 * @param {object} userData - user data of requester
 * @returns {objectId || never} - tenantId
 */
async function acceptInviteRequestAndSetupMember(requestId, userData) {
	const requestData = await requestRepo.fetchRequestById(requestId);

	if (!requestData) throwAppError(REQ_ERROR.REQUEST_NOT_FOUND);

	let credential = !userData.email ? userData.mobile : userData.email;

	//validate request receiver
	await validateReqUpdater(requestData, credential);
	await validateReqStatus(requestData);

	//check tenant status
	await checkTenantStatus(requestData.tenantId);

	//using session to avoid issues
	const session = await mongoose.startSession();

	try {
		const result = await session.withTransaction(async () => {
			//update request status
			await requestRepo.updateRequestById(
				requestId,
				{ requestStatus: "accepted", isActive: false },
				session
			);

			//create and setup membership in tenant for user.
			await createTenantMembershipForUser(
				userData,
				requestData?.tenantId,
				session
			);

			//add tenantId to user
			await userRepo.insertTenantIdIntoUserById(
				requestData.tenantId,
				userData._id,
				session
			);

			return requestData.tenantId;
		});

		return result;
	} catch (error) {
		throw error;
	} finally {
		await session.endSession();
	}
}

// /:requestId/reject
/**
 *
 * @param {string || objectId} requestId - request id to reject
 * @param {object} userData - user data of requester
 * @returns {void || never} - void
 */
async function rejectTenantInviteRequest(requestId, userData) {
	//1. check request exist
	const requestData = await requestRepo.fetchRequestById(requestId);

	console.log(requestData);
	if (!requestData) throwAppError(REQ_ERROR.REQUEST_NOT_FOUND);

	let credential = !userData.email ? userData.mobile : userData.email;

	//2. validate request receiver
	await validateReqUpdater(requestData, credential);
	await validateReqStatus(requestData);

	//3. since its just reject nothing more to do
	const updatedRequest = await requestRepo.updateRequestById(requestId, {
		requestStatus: "rejected",
		isActive: false,
	});

	console.log(updatedRequest);
	//if not updated
	if (!updatedRequest) throwAppError(CRUD_ERROR.UNABLE_TO_UPDATE);

	//return if updated
	return;
}


// /:tenantId/cancel-mine/:requestId
/**
 * 
 * @param {string|| objectId} tenantId 
 * @param {string|| objectId} requestId 
 * @param {object} userData - user data of requester
 * @returns {void || never} - void
 */
async function cancelMyTenantInviteRequest(tenantId, requestId, userData) {
	//1. verify request exist
	const requestData = await requestRepo.fetchRequestByIds(tenantId,requestId,"receiverCredential senderId isActive requestStatus");

	if (!requestData) throwAppError(REQ_ERROR.REQUEST_NOT_FOUND);

	//2. validate request updater is sender of this request
	await validateReqUpdater(requestData, userData._id);
	//validate request
	await validateReqStatus(requestData);

	//3. update request to cancelled
	const updatedRequest = await requestRepo.updateRequestById(requestId,{
		requestStatus:"cancelled",
		isActive:false,
	})

	if(!updatedRequest) throwAppError(CRUD_ERROR.UNABLE_TO_UPDATE);

	return;

}

// /:tenantId/cancel/:requestId
/**
 * 
 * @param {string|| objectId} tenantId 
 * @param {string|| objectId} requestId 
 * @returns {void || never} - void
 */
async function cancelTenantInviteRequest(tenantId, requestId) {
	//1. verify request exist
	const requestData = await requestRepo.fetchRequestByIds(tenantId,requestId,"isActive requestStatus");

	if (!requestData) throwAppError(REQ_ERROR.REQUEST_NOT_FOUND);

	//2. "NOTE"
	await validateReqStatus(requestData);

	//3. update request to cancelled
	const updatedRequest = await requestRepo.updateRequestById(requestId,{
		requestStatus:"cancelled",
		isActive:false,
	})

	if(!updatedRequest) throwAppError(CRUD_ERROR.UNABLE_TO_UPDATE);

	return;

}
module.exports = {
	getActiveRequestsOfUser,
	acceptInviteRequestAndSetupMember,
	rejectTenantInviteRequest,
	cancelMyTenantInviteRequest,
	cancelTenantInviteRequest
};
