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
 * @param {*} credential - email/mobile of user to find with
 * @returns 
 */
async function fetchRequestByCombination(tenantId,credential){
    const convertedId = await convertStrToObjectId(tenantId)
    return await RequestModel.findOne({tenantId:convertedId, receiverCredential: credential,isActive:true})    
}

module.exports = {
    createRequestByData,
    fetchRequestByCombination
}