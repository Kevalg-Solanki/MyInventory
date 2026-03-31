//constants
const PERMS_SET = require("../../constants/permSets");

//middlewares
const verifyRolePermission = require("../../middlewares/verifyRolePermission");
const verifyToken = require("../../middlewares/verifyToken");
const validateRequest = require("../../middlewares/validateRequest");

//validators
const {
	createTenantCustomRoleSchema,
	updateTenantCustomRoleDetailsSchema,
} = require("./tenantRole.validation");

//controllers
const {
	getTenantAllRoleListWithoutPerms,
	getTenantAllRoleListWithPerms,
	getTenantRoleDetailsWithoutPerms,
	getTenantRoleDetailsWithPerms,
	getTenantMemberRolesWithoutPerms,
	getTenantMemberRolesWithPerms,
	getTenantMemberCombinedPerms,
	createCustomRole,
	updateCustomRole,
	assignRoleToTenantMember,
	removeRoleFromTenantMember,
	deleteCustomRole,
} = require("./tenantRole.controller");

//crete controller
const tenantRoleRouter = require("express").Router();

//**Get all roles without permissions
tenantRoleRouter.get(
	"/:tenantId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_ALL_PERMS),
	getTenantAllRoleListWithoutPerms
);

//**Get all roles with permissions
tenantRoleRouter.get(
	"/:tenantId/with-permissions",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_ALL_WITH_PERMS),
	getTenantAllRoleListWithPerms
);

//**Get role details without permission
tenantRoleRouter.get(
	"/:tenantId/roles/:roleId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_DETAILS_PERMS),
	getTenantRoleDetailsWithoutPerms
);

//**Get role details with permissions
tenantRoleRouter.get(
	"/:tenantId/roles/:roleId/with-permissions",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_DETAILS_WITH_PERMS),
	getTenantRoleDetailsWithPerms
);

//**Get tenant's member/user roles without permissions
tenantRoleRouter.get(
	"/:tenantId/tenant-members/:memberId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_MEMBER_ROLES_PERMS),
	getTenantMemberRolesWithoutPerms
);

//**Get tenant's member/user roles with permissions
tenantRoleRouter.get(
	"/:tenantId/tenant-members/:memberId/with-permissions",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_MEMBER_ROLES_WITH_PERM),
	getTenantMemberRolesWithPerms
);

//**Get tenant's member/user combined permissions
tenantRoleRouter.get(
	"/:tenantId/tenant-members/:memberId/permissions",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_MEMBER_PERM_COMBINED_PERMS),
	getTenantMemberCombinedPerms
);

//**Create custome role for tenant
tenantRoleRouter.post(
	"/:tenantId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_CREATE_PERMS),
	validateRequest(createTenantCustomRoleSchema),
	createCustomRole
);

//**Update custome role for tenant
tenantRoleRouter.patch(
	"/:tenantId/:roleId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_UPDATE_PERMS),
	validateRequest(updateTenantCustomRoleDetailsSchema),
	updateCustomRole
);

//**Assign role to user in tenant
tenantRoleRouter.patch(
	"/:tenantId/:roleId/assign/:memberId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_ASSIGN_REMOVE_PERMS),
	assignRoleToTenantMember
);

//**Remove role of user
tenantRoleRouter.patch(
	"/:tenantId/:roleId/remove/:memberId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_ASSIGN_REMOVE_PERMS),
	removeRoleFromTenantMember
);

//**Delete tenant custome role
tenantRoleRouter.delete(
	"/:tenantId/:roleId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_DELETE_PERMS),
	deleteCustomRole
);



module.exports = tenantRoleRouter;
