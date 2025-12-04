
//constants
const { REQ_ERROR, TENANT_ERROR } = require("../../constants");

//repositories
const tenantRepo = require("../../repositories/tenant.repository");
const requestRepo = require("../../repositories/request.repository");

//utils
const prepareProperDataForPagination = require("../../utils/prepareProperDataForPagination");
const throwAppError = require("../../utils/throwAppError");
const { default: mongoose } = require("mongoose");



/**
 * 
 * @param {object} requestData - request which is featched by requestId
 * @param {string} userCredential - email/mobile user loged in with
 */
async function validateRequest(requestData,userCredential){
    
    //validate it is user request or not
    if(requestData.receiverCredential!=userCredential) throwAppError(REQ_ERROR.REQUEST_NOT_FOUND);
    
    //request active or not
    if(!requestData.isActive)
    {
        switch(requestData.requestStatus){
            case "cancelled":
                throwAppError(REQ_ERROR.REQUEST_ALREADY_CANCELLED);
                break;
            case "rejected":
                throwAppError(REQ_ERROR.REQUEST_ALREADY_REJECTED);
                break;
            case "accepted":
                throwAppError(REQ_ERROR.REQUEST_ALREADY_ACCEPTED);
                break;
        }
    }

    return;
}

/**
 * 
 * @param {stirng | objectId} tenantId - id of tenant to check status
 * @returns {error || void}
 */
async function checkTenantStatus(tenantId) {
    //tenant status/ tenant exist/not deleted
    const tenantStatus = await tenantRepo.fetchTenantStatusById(tenantId);

    if(!tenantStatus) throwAppError(TENANT_ERROR.TENANT_NOT_FOUND);

    //is deactivated
    if(!tenantStatus.isActive) throwAppError(TENANT_ERROR.TENANT_DEACTIVATED);

    return;
}




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


async function acceptInviteRequestAndSetupMember(requestId,userData){
     
    const requestData = await requestRepo.findRequestById(requestId);

    if(!requestData) throwAppError(REQ_ERROR.REQUEST_NOT_FOUND);

    let credential = !userData.email ? userData.mobile : userData.email;

    //validate request
    await validateRequest(requestData,credential);

    //check tenant status
    await checkTenantStatus(requestData.tenantId);

    //start session to avoid issues
    const session = await mongoose.startSession();
    try
    {
        const result = await session.withTransaction(async ()=>{
            //update request status
            await requestRepo.updateRequestById(requestId,{requestStatus:"accepted",isActive:false},session);

            //create and setup membership in tenant of user


        });
    }
    catch(error)
    {
        
    }finally{
        session.endSession();
    }

}

module.exports = {
    getActiveRequestsOfUser
}