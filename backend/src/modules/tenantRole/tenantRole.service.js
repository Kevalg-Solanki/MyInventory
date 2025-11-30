//models
const { TenantRoleModel } = require("./tenantRole.model");

//constants
const { ROLE_ERROR, CRUD_ERROR, MEMBER_ERROR } = require("../../constants");
const PERMS = require("../../constants/permission");
const PERMS_SET = require("../../constants/permSets");
const AUTO_ENABLE_PERMS_TRIGGER = require("../../constants/autoEnablePermsSet");

//repositories
const tenantRoleRepo = require("../../repositories/tenantRole.repository");

//utiles
const throwAppError = require("../../utils/throwAppError");
const { convertStrToObjectId } = require("../../utils");

//repository
const tenantMemberRepo = require("../../repositories/tenantMember.repository");

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
	let newPermissions = permissions.filter(
		(perm) => !RESTRICTED_PERMS.includes(perm)
	);

	//
	for (const triggerPerm of triggerPermsArray) {
		if (newPermissions.includes(triggerPerm)) {
			console.log("trigger perm found = ",triggerPerm)
			for (const perm of AUTO_ENABLE_PERMS_TRIGGER[triggerPerm]) {
				console.log("perm of tirgger perm = ", perm);
				
				//recursive which runs until all auto enable perms for this perm included in array.
				
				//**IGNORE** THIS COMMENT - (personal note):spent 2 hour for this recurssion function.
				const returnRequiredPermsArray = (permission) => {
					console.log("function start ",permission)
					//1. check is permission passed in function is trigger permission.
					if (triggerPermsArray.includes(permission)) {
						console.log("permission is trigger perm ")
						let permsToReturn = [permission];//returned perm will added in this.

						//2. if permission is found in triggerPermArray then: 
						//   -->iterate through its each element of array stored in this trigger permission.
						for(const currentPerm of AUTO_ENABLE_PERMS_TRIGGER[permission])
						{
							//3. call this again function for recursion until returns value
							let returnedPermissions = returnRequiredPermsArray(currentPerm);
							//push returned array

							permsToReturn.push(...returnedPermissions);
						}

						//4. remove duplicate values and return array
						console.log("returnig array ",permsToReturn)
						return [...new Set(permsToReturn)];
					}
					console.log("permission is not trigger perm ",[permission])
					//return permission passed is not trigger permission
					return [permission];
				};

				const autoEnablePerms = returnRequiredPermsArray(perm);
				console.log("auto enable perms ",autoEnablePerms)
				newPermissions = [...new Set([...newPermissions,...autoEnablePerms])];
				console.log("new permissions",newPermissions)
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
		return await tenantRoleRepo.findAndCombinePermsFromAllRolesByRoleIds(roleIds);
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
	const allRoleLists = await tenantRoleRepo.findAllRolesWithoutPermsByTenantId(tenantId);

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
	const allRoleLists = await tenantRoleRepo.findAllRolesWithPermsByTenantId(tenantId);

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
	const roleDetails = await tenantRoleRepo.findRoleDetailsWithoutPermsByIds(tenantId, roleId);

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
	const roleDetails = await tenantRoleRepo.findRoleDetailsWithPermsByIds(tenantId, roleId);

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
		const tenantMember = await tenantRoleRepo.findTenantMemberByTenantAndMemberId(
			tenantId,
			memberId
		);

		if (!tenantMember) throwAppError(MEMBER_ERROR.MEMBER_NOT_FOUND);

		//find roles of member
		const roleIds = tenantMember?.roles;

		const memberRoles = await tenantRoleRepo.findRolesPermsByRoleIds(roleIds);

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
		const tenantMember = await tenantMemberRepo.findTenantMemberByTenantAndMemberId(
			tenantId,
			memberId
		);

		if (!tenantMember) throwAppError(MEMBER_ERROR.MEMBER_NOT_FOUND);

		//find roles of member
		const roleIds = tenantMember?.roles;

		const memberRoles = await tenantRoleRepo.findRolesPermsByRoleIds(roleIds, true);

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
		const tenantMember = await tenantMemberRepo.findTenantMemberByTenantAndMemberId(
			tenantId,
			memberId
		);

		if (!tenantMember) throwAppError(MEMBER_ERROR.MEMBER_NOT_FOUND);

		const roleIds = tenantMember?.roles;

		const memberCombinedPerms = await tenantRoleRepo.findAndCombinePermsFromAllRolesByRoleIds(
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

	const savedCustomRole = await tenantRoleRepo.saveCustomTenantRole(tenantRoleToSave);

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
	const updatedRoleData = await tenantRoleRepo.updateRoleByIds(
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
	const tenantMember = await tenantRoleRepo.findTenantMemberByTenantAndMemberId(
		tenantId,
		memberId
	);

	if (!tenantMember) throwAppError(MEMBER_ERROR.MEMBER_NOT_FOUND);

	//find role
	const roleToAssign = await tenantRoleRepo.findRoleDetailsWithoutPermsByIds(tenantId, roleId);

	if (!roleToAssign) throwAppError(ROLE_ERROR.ROLE_NOT_FOUND);

	if (tenantMember?.roles.includes(roleToAssign?._id))
		throwAppError(ROLE_ERROR.ROLE_ALREADY_ASSIGNED);

	console.log(roleToAssign._id);
	//if both found then add role id to member roles
	const updatedMember = await tenantMemberRepo.addRoleIdToMemberByIds(
		tenantId,
		memberId,
		roleToAssign?._id
	);
	console.log(updatedMember);
	if (!updatedMember) throwAppError(CRUD_ERROR.UNABLE_TO_UPDATE);

	return updatedMember;
}

async function removeRoleFromMemberByIds(tenantId, roleId, memberId) {
	//find tenant member
	const tenantMember = await tenantMemberRepo.findTenantMemberByTenantAndMemberId(
		tenantId,
		memberId
	);

	console.log(tenantMember);
	if (!tenantMember) throwAppError(MEMBER_ERROR.MEMBER_NOT_FOUND);

	//find role
	const roleToRemove = await tenantRoleRepo.findRoleDetailsWithoutPermsByIds(tenantId, roleId);

	if (!roleToRemove) throwAppError(ROLE_ERROR.ROLE_NOT_FOUND);

	if (!tenantMember?.roles.includes(roleToRemove?._id))
		throwAppError(ROLE_ERROR.ROLE_NOT_ASSIGNED);

	console.log(roleToRemove._id);
	//if both found then add role id to member roles
	const updatedMember = await tenantMemberRepo.removeRoleIdFromMemberByIds(
		tenantId,
		memberId,
		roleToRemove?._id
	);

	if (!updatedMember) throwAppError(CRUD_ERROR.UNABLE_TO_UPDATE);

	return updatedMember;
}


async function deleteTenantCustomRole(tenantId,roleId){

	//check if role exist and not deleted
	const roleInDatabase = await tenantRoleRepo.findRoleDetailsWithoutPermsByIds(tenantId,roleId);

	if(!roleInDatabase) throwAppError(ROLE_ERROR.ROLE_NOT_FOUND);

	//soft delete role
	await tenantRoleRepo.deleteRoleByIds(tenantId,roleId)
	

	return;
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
	removeRoleFromMemberByIds,
	deleteTenantCustomRole
};
