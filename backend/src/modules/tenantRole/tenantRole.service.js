//constants
const { ROLE_ERROR } = require("../../constants");

//repositories
const {
	findAllRolesWithoutPermsByTenantId,
	findAllRolesWithPermsByTenantId,
	findRoleDetailsWithoutPermsByIds,
	findRoleDetailsWithPermsByIds,
	findAndCombinePermsFromAllRolesByRoleIds,
	findRolesWithoutPermsByRoleIds
} = require("../../repositories/tenantRole.repository");
const throwAppError = require("../../utils/throwAppError");


/**
 * - Used for Combining all permission from different roles by roles id
 * @param {Array} roleIds - Array of role ids to combine permission
 * @param {Array} - filtered permissions in string
 */
async function getCombinedPermsOfRolesByRoleIds(roleIds) {
	try {
		return await findAndCombinePermsFromAllRolesByRoleIds(roleIds)

	} catch (error) {
		throw error;
	}
}

/**
 *
 * @param {string} tenantId
 * @returns {Array} - null or array of object
 */
async function getRoleListWithoutPermsByTenantId(tenantId) {
	const allRoleLists = await findAllRolesWithoutPermsByTenantId(tenantId);

	if (!allRoleLists) {
		throwAppError(ROLE_ERROR.ROLE_NOT_FOUND);
	}

	console.log(allRoleLists);

	return allRoleLists;
}

/**
 *
 * @param {string} tenantId
 * @returns {Array} - null or array of object
 */
async function getRoleListWithPermsByTenantId(tenantId) {
	const allRoleLists = await findAllRolesWithPermsByTenantId(tenantId);

	if (!allRoleLists) {
		throwAppError(ROLE_ERROR.ROLE_NOT_FOUND);
	}

	console.log(allRoleLists);

	return allRoleLists;
}

/**
 * @param {string} tenantId
 * @param {string} roleId
 * @returns
 */
async function getRoleDetailsWithoutPermsByIds(tenantId,roleId) {
	
	const roleDetails = await findRoleDetailsWithoutPermsByIds(tenantId,roleId);

	if (roleDetails.length==0) {
		throwAppError(ROLE_ERROR.ROLE_NOT_FOUND);
	}

	return roleDetails;
}

/**
 * @param {string} tenantId
 * @param {string} roleId
 * @returns
 */
async function getRoleDetailsWithPermsByIds(tenantId,roleId) {
	const roleDetails = await findRoleDetailsWithPermsByIds(tenantId,roleId);

	if (!roleDetails) {
		throwAppError(ROLE_ERROR.ROLE_NOT_FOUND);
	}

	return roleDetails;
}


async function getMemberRolesWithoutPermsByRoleIds(roleIds){
	try
	{
		const userRoles = await findRolesWithoutPermsByRoleIds(roleIds);
		console.log(userRoles)
		if(!userRoles) throwAppError(ROLE_ERROR.ROLE_NOT_FOUND);

		return userRoles;
	}
	catch(error)
	{
		throw error;
	}
}


module.exports = {
	getCombinedPermsOfRolesByRoleIds,
	getRoleListWithoutPermsByTenantId,
	getRoleListWithPermsByTenantId,
	getRoleDetailsWithoutPermsByIds,
	getRoleDetailsWithPermsByIds,
	getMemberRolesWithoutPermsByRoleIds
};
