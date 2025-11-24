//constants
const { TENANT_ERROR } = require("../../constants");

//utils
const throwAppError = require("../../utils/throwAppError");

//services
const SERVICE = require("./tenantMember.service");





//**POST /:tenantId/invite-platform
async function inviteUserToPlatformAndTenant(req,res,next){
    try{
        const {type,credential} = req.body;
        const {tenantId} = req.params;

        if(!tenantId) throwAppError(TENANT_ERROR.TENANT_NOT_FOUND)
    }
    catch(error)
    {
        next(error);
    }
}


module.exports = {
    inviteUserToPlatformAndTenant
}
