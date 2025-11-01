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
			{ $unwind: "$permissions" },
			//group all array into one and $addToSet only preserv unquie so not duplicate permissions
			{ group: { _id: null, permissions: { $addToSet: "$permissions" } } },
		];

		const permissions = await TenantRoleModel.aggregate(pipeline);

		return permissions;
	} catch (error) {
		throw error;
	}
}

module.exports = {
	getCombinedPermsOfRolesByRoleIds,
};
