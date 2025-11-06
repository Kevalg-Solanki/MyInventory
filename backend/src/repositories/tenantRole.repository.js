const { TenantRoleModel } = require("../modules/tenantRole/tenantRole.model");
const { convertStrToObjectId } = require("../utils");

async function getAllRolesByTenantId(tenantId) {
	const convertedId = await convertStrToObjectId(tenantId);

	return await TenantRoleModel.find(
        {tenantId: convertedId, isDeleted: false,},
        {roleName:1,roleColor:1,numberOfUserAssigned:1,_id:1}
    ).lean();
}

module.exports = {
    getAllRolesByTenantId
}
