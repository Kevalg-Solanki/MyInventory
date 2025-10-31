//models
const { TenantMemberModel } = require("./tenantMember.model");




async function findTenantMemberByIds(userId, tenantId) {
	return await TenantMemberModel.findOne({ tenantId, userId });
}


module.exports = {
    findTenantMemberByIds
}
