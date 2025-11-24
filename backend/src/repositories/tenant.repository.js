//models
const { TenantModel } = require("../modules/tenant/tenant.model");
const { convertStrToObjectId } = require("../utils");




/**
 * @param {string} tenantId - id of tenant to get data
 * @returns
 */
async function fetchTenantDataById(tenantId) {
    if (!tenantId.match(/^[0-9a-fA-F]{24}$/)) {
        throwAppError(TENANT_ERROR.TENANT_INVALID_ID);
    }
    const convertedId = await convertStrToObjectId(tenantId);

    return await TenantModel.findOne({_id:convertedId,isDeleted:false});
}

/**
 * @param {string} tenantId - id of tenant to get data
 * @returns
 */
async function findTenantStatusById(tenantId) {
    if (!tenantId.match(/^[0-9a-fA-F]{24}$/)) {
        throwAppError(TENANT_ERROR.TENANT_INVALID_ID);
    }
    const convertedId = await convertStrToObjectId(tenantId);

    return await TenantModel.findOne({_id:convertedId,isDeleted:false}).select("isDelete isActive");
}

module.exports = {
    fetchTenantDataById,
    findTenantStatusById
}