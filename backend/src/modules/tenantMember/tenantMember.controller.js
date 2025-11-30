//constants
const { TENANT_ERROR } = require("../../constants");

//utils
const throwAppError = require("../../utils/throwAppError");
const sendResponse = require("../../utils/sendResponse.js");

//memberServices
const memberServices = require("./tenantMember.service");





//**POST /:tenantId/invite-platform
async function inviteUserToPlatformAndTenant(req,res,next){
    try{
        const {type,credential} = req.body;
        const {tenantId} = req.params;

        if(!tenantId) throwAppError(TENANT_ERROR.TENANT_NOT_FOUND)
        
        await memberServices.inviteUserToPlatformAndSendInviteRequest(tenantId,type,credential,req.user);

        return sendResponse(res,200,"Invitation to platform and invite request send!.");
    }
    catch(error)
    {
        next(error);
    }
}


module.exports = {
    inviteUserToPlatformAndTenant
}
