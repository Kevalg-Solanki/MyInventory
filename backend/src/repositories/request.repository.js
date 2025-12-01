//models
const { RequestModel } = require("../modules/request/request.model");

//utils
const { convertStrToObjectId } = require("../utils");



/**
 * 
 * @param {object} requestData - request data to save
 * @returns - null or saved document
 */
async function createRequestByData(requestData){
    return await RequestModel.create(requestData);
 
}

/**
 * 
 * @param {string} tenantId -id of tenant to find request
 * @param {string} credential - email/mobile of user to find with
 * @returns 
 */
async function fetchRequestByCombination(tenantId,credential){
    const convertedId = await convertStrToObjectId(tenantId)
    return await RequestModel.findOne({tenantId:convertedId, receiverCredential: credential,isActive:true})    
}

/**
 * 
 * @param {string} credential - email/mobile of user to find with
 * @returns {object | null} 
 */
async function fetchAllActiveRequestByReceiverCredential(credential){
    
    return await RequestModel.find({receiverCredential:credential,isDeleted:false,isActive:true}).select("-isDeleted -senderId -isActive -receiverCredential").lean();
}

module.exports = {
    createRequestByData,
    fetchRequestByCombination,
    fetchAllActiveRequestByReceiverCredential
}