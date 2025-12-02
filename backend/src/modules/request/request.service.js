
//repositories
const tenantRepo = require("../../repositories/tenant.repository");
const requestRepo = require("../../repositories/request.repository");


//utils




/**
 * 
 * @param {string} userCredential - email/mobile of user to find request for
 * @param {object} pagination - {page:number,limit:number,sort:object}
 * @return {object} - throw error if something is wrong
 */
async function getActiveRequestsOfUser(userCredential,pagination){

    const allRequestOfUser = await requestRepo.fetchAllActiveRequestByReceiverCredential(userCredential,pagination);

    
}


module.exports = {
    getAllRequestOfUser
}