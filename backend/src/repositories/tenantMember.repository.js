//models

const { TenantMemberModel } = require("../modules/tenantMember/tenantMember.model");





/**
 * - Finding tenant member by userId,tenantId
 * @param {string} userId 
 * @param {string} tenantId 
 * @returns {Object} - null if not found
 */
async function findTenantMemberByIds(userId, tenantId) {
	return await TenantMemberModel.findOne({ tenantId, userId,isDeleted:false });
}



module.exports = {
    findTenantMemberByIds
}
