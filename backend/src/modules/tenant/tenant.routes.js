//middlewares
const validateRequest = require("../../middlewares/validateRequest");
const verifyToken = require("../../middlewares/verifyToken.js");

//validator
const {
	createTenantSchema,
	updateTenantSchema,
} = require("./tenant.validation.js");

//controller
const {
	createTenant,
	getTenantData,
	getTenantsConnectedToUser,
	loginInTenant,
	updateTenant,
	deactivateTenant,
	deleteTenant
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
tenantRouter.post("/login", verifyToken, loginInTenant);

//**Delete tenant
tenantRouter.delete("/:tenantId",verifyToken,deleteTenant);


//--DYNAMIC PATHS

//**Get tenant all data
tenantRouter.get("/:tenantId", verifyToken, getTenantData);

//**Update tenant
tenantRouter.patch("/:tenantId", verifyToken, validateRequest(updateTenantSchema), updateTenant);

//**Deactivate tenant
tenantRouter.patch("/deactivate/:tenantId", verifyToken, deactivateTenant);

module.exports = tenantRouter;
