//constants
const { USER_ERROR } = require("../../constants");

//utils
const sendResponse = require("../../utils/sendResponse");
const throwAppError = require("../../utils/throwAppError");

//services
const {
	getRoleListWithoutPermsByTenantId,
	getRoleListWithPermsByTenantId,
	getRoleDetailsWithoutPermsByIds,
	getRoleDetailsWithPermsByIds,
	getMemberRolesWithoutPermsByRoleIds,
	getMemberRolesWithPermsByRoleIds,
	getMemberCombinedPermsByRoleIds,
	createCustomRoleForTenant,
	updateTenantCustomRole,
} = require("./tenantRole.service");

//tenantRole/:tenantId
async function getTenantAllRoleListWithoutPerms(req, res, next) {
	try {
		const { tenantId } = req.params;

		const roleList = await getRoleListWithoutPermsByTenantId(tenantId);

		return sendResponse(res, 200, "Roles fetched successfully.", { roleList });
	} catch (error) {
		next(error);
	}
}

//**tenantRole/:tenantId/with-permissions
async function getTenantAllRoleListWithPerms(req, res, next) {
	try {
		const { tenantId } = req.params;

		const roleList = await getRoleListWithPermsByTenantId(tenantId);

		return sendResponse(
			res,
			200,
			"Roles with permissions fetched successfully.",
			{ roleList }
		);
	} catch (error) {
		next(error);
	}
}

//**tenantRole/roles/:roleId
async function getTenantRoleDetailsWithoutPerms(req, res, next) {
	try {
		const { tenantId, roleId } = req.params;

		const roleDetails = await getRoleDetailsWithoutPermsByIds(tenantId, roleId);

		return sendResponse(res, 200, "Role details fetched successfully.", {
			roleDetails,
		});
	} catch (error) {
		next(error);
	}
}

//**/roles/:roleId/with-permissions
async function getTenantRoleDetailsWithPerms(req, res, next) {
	try {
		const { tenantId, roleId } = req.params;

		const roleDetailsWithPerms = await getRoleDetailsWithPermsByIds(
			tenantId,
			roleId
		);

		return sendResponse(res, 200, "Role details fetched successfully.", {
			roleDetailsWithPerms,
		});
	} catch (error) {
		next(error);
	}
}

//**/:tenantId/users/:userId
async function getTenantMemberRolesWithoutPerms(req, res, next) {
	try {
		const { userId } = req.params;

		if (!userId) throwAppError(USER_ERROR.USER_NOT_FOUND);
		const memberRolesWithoutPerms = await getMemberRolesWithoutPermsByRoleIds(
			req?.tenantMemberRoleIds
		);

		return sendResponse(res, 200, "Member Roles fetched successfully.", {
			memberRolesWithoutPerms,
		});
	} catch (error) {
		next(error);
	}
}

//**/:tenantId/tenant-members/:userId/with-permission
async function getTenantMemberRolesWithPerms(req, res, next) {
	try {
		const { userId } = req.params;

		if (!userId) throwAppError(USER_ERROR.USER_NOT_FOUND);
		const memberRolesWithPerms = await getMemberRolesWithPermsByRoleIds(
			req?.tenantMemberRoleIds
		);

		return sendResponse(
			res,
			200,
			"Member Roles with permissions fetched successfully.",
			{
				memberRolesWithPerms,
			}
		);
	} catch (error) {
		next(error);
	}
}

//**/:tenantId/tenant-members/:userId/with-permission
async function getTenantMemberCombinedPerms(req, res, next) {
	try {
		const { userId } = req.params;

		if (!userId) throwAppError(USER_ERROR.USER_NOT_FOUND);
		const memberCombinedPerms = await getMemberCombinedPermsByRoleIds(
			req?.tenantMemberRoleIds
		);

		return sendResponse(res, 200, "Member permissions fetched successfully.", {
			memberCombinedPerms,
		});
	} catch (error) {
		next(error);
	}
}

//**POST /:tenantId
async function createCustomRole(req, res, next) {
	try {
		const { tenantId } = req.params;

		const savedCustomRole = await createCustomRoleForTenant(tenantId, req.body);

		return sendResponse(res, 201, "New role created.", { savedCustomRole });
	} catch (error) {
		next(error);
	}
}


//**PATCH /:tenantId/:roleId
async function updateCustomRole(req, res, next) {
	try {
		const { tenantId,roleId } = req.params;
		const {include} = req.query;

		const updatePerms = include==="permissions";
		const updatedCustomRole = await updateTenantCustomRole(tenantId,roleId,req.body,updatePerms);

		return sendResponse(res, 200, "Role details updated.", { updatedCustomRole });
	} catch (error) {
		next(error);
	}
}


module.exports = {
	getTenantAllRoleListWithoutPerms,
	getTenantAllRoleListWithPerms,
	getTenantRoleDetailsWithoutPerms,
	getTenantRoleDetailsWithPerms,
	getTenantMemberRolesWithoutPerms,
	getTenantMemberRolesWithPerms,
	getTenantMemberCombinedPerms,
	createCustomRole,
	updateCustomRole  
};
