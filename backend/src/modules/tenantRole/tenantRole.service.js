const {
	getAllRolesByTenantId,
} = require("../../repositories/tenantRole.repository");
const { TenantRoleModel } = require("./tenantRole.model");

/**
 * - Used for Combining all permission from different roles by roles id
 * @param {Array} roleIds - Array of role ids to combine permission
 * @param {Array} - filtered permissions in string
 */
async function getCombinedPermsOfRolesByRoleIds(roleIds) {
	try {
		const pipeline = [
			{ $match: { _id: { $in: roleIds }, isDeleted: false } },
			{
				$project: {
					permissions: 1,
					_id: 0, //exclude _id which by default included
				},
			},
			//make different documents for each permission array with $unwind
			{ $unwind: { path: "$permissions", preserveNullAndEmptyArrays: false } },
			//group all array into one and $addToSet only preserv unquie so not duplicate permissions
			{ $group: { _id: null, permissions: { $addToSet: "$permissions" } } },
			//get flat array
			{
				$project: {
					_id: 0,
					permissions:1
				},
			},
		];

		console.log(pipeline);
		const permsDocs = await TenantRoleModel.aggregate(pipeline);
		console.log(permsDocs[0].permissions);
		return permsDocs[0].permissions;
	} catch (error) {
		throw error;
	}
}

async function getAllRoleListWithoutPerms(tenantId) {
	const allRoleLists = await getAllRolesByTenantId(tenantId);

	console.log(allRoleLists);

	return allRoleLists;
}

module.exports = {
	getCombinedPermsOfRolesByRoleIds,
	getAllRoleListWithoutPerms,
};
