//utils
const paginationHandler = require("../../utils/paginationHandler");
const sendResponse = require("../../utils/sendResponse");

//services
const requestServices = require("./request.service");

// GET /me
async function getAllActiveRequestOfUser(req, res, next) {
	try {
		const pagination = paginationHandler(
			req.query?.page,
			req.query?.limit,
			req.query?.sort
		);

		const userCredential = !req.user.email ? req.user.mobile : req.user.email;

		const {activeRequests,preparedPagination} = await requestServices.getActiveRequestsOfUser(userCredential,pagination);

		return sendResponse(res,200,"All active requests fetched.",{activeRequests,pagination:preparedPagination});

	} catch (error) {
		next(error);
	}
}


// PATCH /:requestId/accept
async function acceptRequest(req, res, next) {
	try {
		const requestId = req.params.requestId;

		const tenantId = await requestServices.acceptInviteRequestAndSetupMember(requestId,req.user);

		return sendResponse(res,200,"Invite request accepted.",{tenantId});

	} catch (error) {
		next(error);
	}
}

async function rejectRequest(req,res,next) {
	try {
		const requestId = req.params.requestId;

		await requestServices.rejectTenantInviteRequest(requestId,req.user);

		return sendResponse(res,200,"Invite request rejected.");
	} catch (error) {
		next(error);		
	}
}

async function cancelRequest(req,res,next) {
	try
	{
		const {tenantId,requestId} = req.params;
		console.log(req.query);

		
		return sendResponse(res,200,"Invite request sent by you cancelled.")
	}
	catch(error)
	{
		next(error);
	}
}


module.exports = {
	getAllActiveRequestOfUser,
	acceptRequest,
	rejectRequest
};
