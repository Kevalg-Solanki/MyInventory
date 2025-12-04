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


// GET /me
async function acceptRequest(req, res, next) {
	try {
		const requestId = req.params.requestId;

		

		return sendResponse(res,200,"All active requests fetched.",{activeRequests,pagination:preparedPagination});

	} catch (error) {
		next(error);
	}
}


module.exports = {
	getAllActiveRequestOfUser,
};
