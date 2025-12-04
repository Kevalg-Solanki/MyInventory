//models
const { RequestModel } = require("../modules/request/request.model");

//utils
const { convertStrToObjectId } = require("../utils");

/**
 *
 * @param {object} requestData - request data to save
 * @returns - null or saved document
 */
async function createRequestByData(requestData) {
	return await RequestModel.create(requestData);
}

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


async function findRequestById(requestId){
	const convertedRequestId = await convertStrToObjectId(requestId);

	return await RequestModel.findById(convertedRequestId);
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
	const [allRequest,totolNumberOfRequests] = await Promise.all([
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
		})
	]);

    return {data:allRequest,totalNumberOfDocs:totolNumberOfRequests};
}


/**
 * @param {string || objectId} requestId - _id of request
 * @param {object} updatedData - updated data of request
 * @param {mongoose session || null} session - this function run query without session by deafult.
 */
async function updateRequestById(requestId,updatedData,session=null) {
	const convertedReqId = await convertStrToObjectId(requestId);
	
	const options = {
		new:true,
		runValidators:true
	}
	
	if(session) options.session=session;

	return await RequestModel.findOneAndUpdate(
		{_id:convertedReqId,isDeleted:false,isActive:true},
		{ $set : updatedData},
		options
	)
}

module.exports = {
	createRequestByData,
	fetchRequestByCombination,
	fetchAllActiveRequestByReceiverCredential,
	findRequestById,
	updateRequestById
};
