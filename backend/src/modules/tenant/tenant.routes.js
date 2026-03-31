//middlewares
const validateRequest = require("../../middlewares/validateRequest");
const verifyToken = require("../../middlewares/verifyToken.js");
const verifyRolePermission = require("../../middlewares/verifyRolePermission.js");

//validator
const tenantValidators = require("./tenant.validation.js");

//constants
const PERMS_SET = require("../../constants/permSets.js");

//controller
const tenantControllers = require("./tenant.controller.js");

//create router
const tenantRouter = require("express").Router();

//APIs

//**Create tenant
tenantRouter.post(
	"/",
	verifyToken,
	validateRequest(tenantValidators.createTenantSchema),
	tenantControllers.createTenant
);

//**Get tenants user joined/owned
tenantRouter.get("/mine", verifyToken, tenantControllers.getTenantsConnectedToUser);

//**Login into tenant
tenantRouter.post(
	"/login",
	verifyToken,
	verifyRolePermission(PERMS_SET.TENANT_LOGIN_PERMS),
	tenantControllers.loginInTenant
);

//**Delete tenant
tenantRouter.delete(
	"/:tenantId",
	verifyToken,
	verifyRolePermission(PERMS_SET.RESTRICTED_PERMS),
	tenantControllers.deleteTenant
);

//--DYNAMIC PATHS

//**Get tenant all data
tenantRouter.get(
	"/:tenantId",
	verifyToken,
	verifyRolePermission(PERMS_SET.TENANT_GET_ALL_DATA_PERMS),
	tenantControllers.getTenantData
);

//**Update tenant
tenantRouter.patch(
	"/:tenantId",
	verifyToken,
	verifyRolePermission(PERMS_SET.TENANT_UPDATE_PERMS),
	validateRequest(tenantValidators.updateTenantSchema),
	tenantControllers.updateTenant
);

//**Deactivate tenant
tenantRouter.patch(
	"/deactivate/:tenantId",
	verifyToken,
	verifyRolePermission(PERMS_SET.RESTRICTED_PERMS),
	tenantControllers.deactivateTenant
);

module.exports = tenantRouter;
