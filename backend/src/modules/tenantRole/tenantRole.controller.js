//services
const sendResponse = require("../../utils/sendResponse");
const { getAllRoleListWithoutPerms } = require("./tenantRole.service");



//tenantRole/:tenantId
async function getTenantAllRoleListWithoutPerms(req,res,next){
    try
    {
        const {tenantId} = req.params;

        const roleList = await getAllRoleListWithoutPerms(tenantId);

        return sendResponse(res,200,"Roles fetched successfully.",{roleList});
    }
    catch(error)
    {
        next(error);
    }
}

module.exports = {
    getTenantAllRoleListWithoutPerms
}