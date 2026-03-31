//models
const { RequestModel } = require("../modules/request/request.model");
const utils = require("../utils");

//utils
const { convertStrToObjectId } = require("../utils");

// -----------CREATE QUERY------------
/**
 *
 * @param {object} requestData - request data to save
 * @returns - null or saved document
 */
async function createRequestByData(requestData) {
	return await RequestModel.create(requestData);
}

//-----------------------------------------------------
// -----------READ QUERY------------

/**
 *
 * @param {string} tenantId -id of tenant to find request
 * @param {string} credential - email/mobile of user to find with
 * @returns
 */
async function fetchRequestByCombination(tenantId, credential) {
	const convertedId = await convertStrToObjectId(tenantId);
	return await RequestModel.findOne({
		tenantId: convertedId,
		receiverCredential: credential,
		isActive: true,
	});
}

/**
 *
 * @param {string} tenantId -id of tenant to find request
 * @param {string} selectedDataQuery - selected fields to get e.g "tenantName tenantCategory ownerId"
 * @returns
 */
async function fetchRequestById(requestId, selectedDataQuery = "") {
	const convertedRequestId = await convertStrToObjectId(requestId);

	return await RequestModel.findOne({
		_id: convertedRequestId,
		isDeleted: false,
	})
		.select(selectedDataQuery)
		.lean();
}

/**
 *
 * @param {String} tenantId - id of tenant to find request of
 * @param {String} requestId - id of reuqest
 * @param {string} selectedDataQuery - selected fields to get e.g "tenantName tenantCategory ownerId"
 * @returns
 */
async function fetchRequestByIds(tenantId, requestId,selectedDataQuery = "") {
	const convertedId = await convertStrToObjectId(tenantId);
	const convertedReqId = await convertStrToObjectId(requestId);

	return await RequestModel.findOne({
		_id: convertedReqId,
		tenantId: convertedId,
		isDeleted: false,
	}).select(selectedDataQuery)
	.lean();
}

/**
 *
 * @param {string} credential - email/mobile of user to find with
 * @param {object} pagination - {skip:number,limit:number,sort:object}
 * @returns {Array of object | []}
 */
async function fetchAllActiveRequestByReceiverCredential(
	credential,
	pagination
) {
	const [allRequest, totolNumberOfRequests] = await Promise.all([
		RequestModel.find({
			receiverCredential: credential,
			isDeleted: false,
			isActive: true,
		})
			.select("-isDeleted -senderId -isActive -receiverCredential")
			.sort(pagination.sort)
			.skip(pagination.skip)
			.limit(pagination.limit)
			.lean(),
		RequestModel.countDocuments({
			receiverCredential: credential,
			isDeleted: false,
			isActive: true,
		}),
	]);

	return { data: allRequest, totalNumberOfDocs: totolNumberOfRequests };
}

//-----------------------------------------------------
// -----------UPDATE QUERY------------

/**
 * @param {string || objectId} requestId - _id of request
 * @param {object} updatedData - updated data of request
 * @param {mongoose session || null} session - this function run query without session by deafult.
 */
async function updateRequestById(requestId, updatedData, session = null) {
	const convertedReqId = utils.convertStrToObjectId(requestId);

	const opts = utils.getDefaultQueryOpts(session);

	return await RequestModel.findOneAndUpdate(
		{ _id: convertedReqId, isDeleted: false, isActive: true },
		{ $set: updatedData },
		opts
	);
}

module.exports = {
	createRequestByData,
	fetchRequestByCombination,
	fetchAllActiveRequestByReceiverCredential,
	fetchRequestById,
	fetchRequestByIds,
	updateRequestById,
};
