//models
const { TenantRoleModel } = require("./tenantRole.model");

//constants
const { ROLE_ERROR, CRUD_ERROR, MEMBER_ERROR } = require("../../constants");
const PERMS = require("../../constants/permission");
const PERMS_SET = require("../../constants/permSets");
const AUTO_ENABLE_PERMS_TRIGGER = require("../../constants/autoEnablePermsSet");

//repositories
const {
	findAllRolesWithoutPermsByTenantId,
	findAllRolesWithPermsByTenantId,
	findRoleDetailsWithoutPermsByIds,
	findRoleDetailsWithPermsByIds,
	findAndCombinePermsFromAllRolesByRoleIds,
	findRolesPermsByRoleIds,
	saveCustomTenantRole,
	updateRoleByIds,
} = require("../../repositories/tenantRole.repository");

//utiles
const throwAppError = require("../../utils/throwAppError");
const { convertStrToObjectId } = require("../../utils");
const {
	findTenantMemberByIds,
	findTenantMemberByTenantAndMemberId,
	addRoleIdToMemberById,
} = require("../../repositories/tenantMember.repository");

//--helpers functions

/**
 *
 */
function addDefaultRequiredPermissions(permissions) {
	if (!permissions || permissions.length === 0) return [PERMS.TENANT_LOGIN];

	//convert to enums array
	const triggerPermsArray = Object.keys(AUTO_ENABLE_PERMS_TRIGGER);
	const RESTRICTED_PERMS = [
		PERMS.TENANT_CO_OWNER_PERMS,
		PERMS.TENANT_OWNER_PERMS,
		...PERMS_SET.RESTRICTED_PERMS,
	];

	console.log(triggerPermsArray);

	//Remove restricted perms
	const newPermissions = permissions.filter(
		(perm) => !RESTRICTED_PERMS.includes(perm)
	);

	//
	for (const triggerPerm of triggerPermsArray) {
		console.log("trigger perm", triggerPerm);
		if (newPermissions.includes(triggerPerm)) {
			for (const perm of AUTO_ENABLE_PERMS_TRIGGER[triggerPerm]) {
				console.log("perm", perm);
				if (!newPermissions.includes(perm)) newPermissions.push(perm);
			}
		}
	}

	return newPermissions;
}

//--Constoller services

/**
 * - Used for Combining all permission from different roles by roles id
 * @param {Array} roleIds - Array of role ids to combine permission
 * @param {Array} - filtered permissions in string
 */
async function getCombinedPermsOfRolesByRoleIds(roleIds) {
	try {
		return await findAndCombinePermsFromAllRolesByRoleIds(roleIds);
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
async function getRoleDetailsWithoutPermsByIds(tenantId, roleId) {
	const roleDetails = await findRoleDetailsWithoutPermsByIds(tenantId, roleId);

	if (roleDetails.length == 0) {
		throwAppError(ROLE_ERROR.ROLE_NOT_FOUND);
	}

	return roleDetails;
}

/**
 * @param {string} tenantId
 * @param {string} roleId
 * @returns
 */
async function getRoleDetailsWithPermsByIds(tenantId, roleId) {
	const roleDetails = await findRoleDetailsWithPermsByIds(tenantId, roleId);

	if (!roleDetails) {
		throwAppError(ROLE_ERROR.ROLE_NOT_FOUND);
	}

	return roleDetails;
}

/**
 * @param {string} tenantId
 * @param {string} memberId
 * @returns {Array}
 */
async function getMemberRolesWithoutPermsByIds(tenantId, memberId) {
	try {
		//find tenant member
		const tenantMember = await findTenantMemberByTenantAndMemberId(
			tenantId,
			memberId
		);

		if (!tenantMember) throwAppError(MEMBER_ERROR.MEMBER_NOT_FOUND);

		//find roles of member
		const roleIds = tenantMember?.roles;

		const memberRoles = await findRolesPermsByRoleIds(roleIds);

		return memberRoles;
	} catch (error) {
		throw error;
	}
}

/**
 * @param {string} tenantId
 * @param {string} memberId
 * @returns {Array}
 */
async function getMemberRolesWithPermsByIds(tenantId, memberId) {
	try {
		//find tenant member
		const tenantMember = await findTenantMemberByTenantAndMemberId(
			tenantId,
			memberId
		);

		if (!tenantMember) throwAppError(MEMBER_ERROR.MEMBER_NOT_FOUND);

		//find roles of member
		const roleIds = tenantMember?.roles;

		const memberRoles = await findRolesPermsByRoleIds(roleIds, true);

		return memberRoles;
	} catch (error) {
		throw error;
	}
}

/**
 * @param {string} tenantId
 * @param {string} memberId
 * @returns {Array}
 */
async function getMemberCombinedPermsByIds(tenantId, memberId) {
	try {
		//find tenant member
		const tenantMember = await findTenantMemberByTenantAndMemberId(
			tenantId,
			memberId
		);

		if (!tenantMember) throwAppError(MEMBER_ERROR.MEMBER_NOT_FOUND);

		const roleIds = tenantMember?.roles;

		const memberCombinedPerms = await findAndCombinePermsFromAllRolesByRoleIds(
			roleIds
		);
		console.log(memberCombinedPerms);
		if (!memberCombinedPerms) throwAppError(ROLE_ERROR.ROLE_NOT_FOUND);

		return memberCombinedPerms;
	} catch (error) {
		throw error;
	}
}

/**
 *
 * @param {string} tenantId
 * @param {Object} roleData
 * @return {Object} - null or object
 */
async function createCustomRoleForTenant(tenantId, roleData) {
	const { roleName, roleColor, isActive, permissions } = roleData;

	//auto add permission if trigger permission if found
	const newPermissions = addDefaultRequiredPermissions(permissions);

	//convert to the objectId
	const convertedTenantId = await convertStrToObjectId(tenantId);

	const tenantRoleToSave = {
		tenantId: convertedTenantId,
		permissions: newPermissions,
		isActive: isActive,
	};

	if (roleName) tenantRoleToSave.roleName = roleName;
	if (roleColor) tenantRoleToSave.roleColor = roleColor;

	const savedCustomRole = await saveCustomTenantRole(tenantRoleToSave);

	if (!savedCustomRole) {
		throwAppError(CRUD_ERROR.UNABLE_TO_SAVE);
	}

	return savedCustomRole;
}

/**
 *
 * @param {string} tenantId - tenantId for finding role
 * @param {string} roleId - roleId used for finding role
 * @param {object} roleData - data to update
 * @param {boolean} updatePerms - true if want to update permissions of role
 * @returns
 */
async function updateTenantCustomRole(
	tenantId,
	roleId,
	roleData,
	updatePerms = false
) {
	let newRoleData = {
		roleName: roleData?.roleName,
		roleColor: roleData?.roleColor,
		isActive: roleData?.isActive,
	};

	if (updatePerms) {
		//auto include required perms
		const newPermissions = await addDefaultRequiredPermissions(
			roleData?.permissions
		);
		//add to role data to update
		newRoleData.permissions = newPermissions;
	}

	console.log(newRoleData);
	const updatedRoleData = await updateRoleByIds(
		tenantId,
		roleId,
		newRoleData,
		updatePerms
	);

	if (!updatedRoleData) throwAppError(CRUD_ERROR.UNABLE_TO_UPDATE);

	return updatedRoleData;
}

async function assignRoleToMemberByIds(tenantId, roleId, memberId) {
	//find tenant member
	const tenantMember = await findTenantMemberByTenantAndMemberId(
		tenantId,
		memberId
	);

	if (!tenantMember) throwAppError(MEMBER_ERROR.MEMBER_NOT_FOUND);

	//find role
	const roleToAssign = await findRoleDetailsWithoutPermsByIds(tenantId, roleId);

	if (!roleToAssign) throwAppError(ROLE_ERROR.ROLE_NOT_FOUND);

	if (tenantMember?.roles.includes(roleToAssign?._id))
		throwAppError(ROLE_ERROR.ROLE_ALREADY_ASSIGNED);

	console.log(roleToAssign._id)
	//if both found then add role id to member roles
	const updatedMember = await addRoleIdToMemberById(
		tenantId,
		memberId,
		roleToAssign?._id
	);
	console.log(updatedMember)
	if (!updatedMember) throwAppError(CRUD_ERROR.UNABLE_TO_UPDATE);

	return updatedMember;
}

module.exports = {
	getCombinedPermsOfRolesByRoleIds,
	getRoleListWithoutPermsByTenantId,
	getRoleListWithPermsByTenantId,
	getRoleDetailsWithoutPermsByIds,
	getRoleDetailsWithPermsByIds,
	getMemberRolesWithoutPermsByIds,
	getMemberRolesWithPermsByIds,
	getMemberCombinedPermsByIds,
	createCustomRoleForTenant,
	updateTenantCustomRole,
	assignRoleToMemberByIds,
};
