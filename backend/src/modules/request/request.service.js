
//repositories
const tenantRepo = require("../../repositories/tenant.repository");
const requestRepo = require("../../repositories/request.repository");


//utils




/**
 * 
 * @param {string} userCredential - email/mobile of user to find request for
 * @return {object} - throw error if something is wrong
 */
async function getAllRequestOfUser(userCredential){

    const allRequestOfUser = await requestRepo.fetchAllActiveRequestByReceiverCredential(userCredential);

    
}


module.exports = {
    getAllRequestOfUser
}