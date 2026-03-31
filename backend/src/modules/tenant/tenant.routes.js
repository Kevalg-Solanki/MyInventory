//middlewares
const validateRequest = require("../../middlewares/validateRequest");
const verifyToken = require("../../middlewares/verifyToken.js");
const verifyRolePermission = require("../../middlewares/verifyRolePermission.js");

//validator
const {
	createTenantSchema,
	updateTenantSchema,
} = require("./tenant.validation.js");

//constants
const PERMS_SET = require("../../constants/permSets.js");

//controller
const {
	createTenant,
	getTenantData,
	getTenantsConnectedToUser,
	loginInTenant,
	updateTenant,
	deactivateTenant,
	deleteTenant,
} = require("./tenant.controller.js");

//create router
const tenantRouter = require("express").Router();

//APIs

//**Create tenant
tenantRouter.post(
	"/",
	verifyToken,
	validateRequest(createTenantSchema),
	createTenant
);

//**Get tenants user joined/owned
tenantRouter.get("/mine", verifyToken, getTenantsConnectedToUser);

//**Login into tenant
tenantRouter.post(
	"/login",
	verifyToken,
	verifyRolePermission(PERMS_SET.TENANT_LOGIN_PERMS),
	loginInTenant
);

//**Delete tenant
tenantRouter.delete(
	"/:tenantId",
	verifyToken,
	verifyRolePermission(PERMS_SET.RESTRICTED_PERMS),
	deleteTenant
);

//--DYNAMIC PATHS

//**Get tenant all data
tenantRouter.get(
	"/:tenantId",
	verifyToken,
	verifyRolePermission(PERMS_SET.TENANT_GET_ALL_DATA_PERMS),
	getTenantData
);

//**Update tenant
tenantRouter.patch(
	"/:tenantId",
	verifyToken,
	verifyRolePermission(PERMS_SET.TENANT_UPDATE_PERMS),
	validateRequest(updateTenantSchema),
	updateTenant
);

//**Deactivate tenant
tenantRouter.patch(
	"/deactivate/:tenantId",
	verifyToken,
	verifyRolePermission(PERMS_SET.RESTRICTED_PERMS),
	deactivateTenant
);

module.exports = tenantRouter;
