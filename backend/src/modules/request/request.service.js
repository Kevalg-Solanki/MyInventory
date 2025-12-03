
//constants
const { REQ_ERROR } = require("../../constants");

//repositories
const tenantRepo = require("../../repositories/tenant.repository");
const requestRepo = require("../../repositories/request.repository");

//utils
const prepareProperDataForPagination = require("../../utils/prepareProperDataForPagination");




/**
 * 
 * @param {string} userCredential - email/mobile of user to find request for
 * @param {object} pagination - {page:number,limit:number,sort:object}
 * @return {object} - throw error if something is wrong
 */
async function getActiveRequestsOfUser(userCredential,pagination){

    const {data,totalNumberOfDocs} = await requestRepo.fetchAllActiveRequestByReceiverCredential(userCredential,pagination);

    let preparedPagination = prepareProperDataForPagination(pagination,totalNumberOfDocs);
    
    return {activeRequests:data,preparedPagination};
}


module.exports = {
    getActiveRequestsOfUser
}