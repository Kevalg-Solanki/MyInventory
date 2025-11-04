//models
const { TenantModel } = require("../modules/tenant/tenant.model");




/**
 * @param {string} tenantId - id of tenant to get data
 * @returns
 */
async function getTenantDataById(tenantId) {
    if (!tenantId.match(/^[0-9a-fA-F]{24}$/)) {
        throwAppError(TENANT_ERROR.TENANT_INVALID_ID);
    }
    return await TenantModel.findById(tenantId);
}


module.exports = {
    getTenantDataById   
}