//constants
const PERMS_SET = require("../../constants/permSets");

//middlewares
const verifyRolePermission = require("../../middlewares/verifyRolePermission");
const verifyToken = require("../../middlewares/verifyToken");
const validateRequest = require("../../middlewares/validateRequest");

//validators
const tenantRoleValidators = require("./tenantRole.validation");

//controllers
const tenantRoleControllers = require("./tenantRole.controller");

//crete controller
const tenantRoleRouter = require("express").Router();

//**Get all roles without permissions
tenantRoleRouter.get(
	"/:tenantId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_ALL_PERMS),
	tenantRoleControllers.getTenantAllRoleListWithoutPerms
);

//**Get all roles with permissions
tenantRoleRouter.get(
	"/:tenantId/with-permissions",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_ALL_WITH_PERMS),
	tenantRoleControllers.getTenantAllRoleListWithPerms
);

//**Get role details without permission
tenantRoleRouter.get(
	"/:tenantId/roles/:roleId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_DETAILS_PERMS),
	tenantRoleControllers.getTenantRoleDetailsWithoutPerms
);

//**Get role details with permissions
tenantRoleRouter.get(
	"/:tenantId/roles/:roleId/with-permissions",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_DETAILS_WITH_PERMS),
	tenantRoleControllers.getTenantRoleDetailsWithPerms
);

//**Get tenant's member/user roles without permissions
tenantRoleRouter.get(
	"/:tenantId/tenant-members/:memberId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_MEMBER_ROLES_PERMS),
	tenantRoleControllers.getTenantMemberRolesWithoutPerms
);

//**Get tenant's member/user roles with permissions
tenantRoleRouter.get(
	"/:tenantId/tenant-members/:memberId/with-permissions",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_MEMBER_ROLES_WITH_PERM),
	tenantRoleControllers.getTenantMemberRolesWithPerms
);

//**Get tenant's member/user combined permissions
tenantRoleRouter.get(
	"/:tenantId/tenant-members/:memberId/permissions",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_MEMBER_PERM_COMBINED_PERMS),
	tenantRoleControllers.getTenantMemberCombinedPerms
);

//**Create custome role for tenant
tenantRoleRouter.post(
	"/:tenantId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_CREATE_PERMS),
	validateRequest(tenantRoleValidators.createTenantCustomRoleSchema),
	tenantRoleControllers.createCustomRole
);

//**Update custome role for tenant
tenantRoleRouter.patch(
	"/:tenantId/:roleId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_UPDATE_PERMS),
	validateRequest(tenantRoleValidators.updateTenantCustomRoleDetailsSchema),
	tenantRoleControllers.updateCustomRole
);

//**Assign role to user in tenant
tenantRoleRouter.patch(
	"/:tenantId/:roleId/assign/:memberId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_ASSIGN_REMOVE_PERMS),
	tenantRoleControllers.assignRoleToTenantMember
);

//**Remove role of user
tenantRoleRouter.patch(
	"/:tenantId/:roleId/remove/:memberId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_ASSIGN_REMOVE_PERMS),
	tenantRoleControllers.removeRoleFromTenantMember
);

//**Delete tenant custome role
tenantRoleRouter.delete(
	"/:tenantId/:roleId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_DELETE_PERMS),
	tenantRoleControllers.deleteCustomRole
);



module.exports = tenantRoleRouter;
