//middlewares
const validateRequest = require("../../middlewares/validateRequest");
const verifyToken = require("../../middlewares/verifyToken.js");

//validator
const { createTenantSchema } = require("./tenant.validation.js");

//controller
const {
	createTenant,
	getTenantData,
	getTenantsConnectedToUser,
} = require("./tenant.controller.js");

//create router
const tenantRouter = require("express").Router();

//APIs

//**Create tenant
tenantRouter.post("/", verifyToken, validateRequest(createTenantSchema), createTenant);

//**Get tenants user joined/owned
tenantRouter.get("/mine", verifyToken, getTenantsConnectedToUser);

//**Login into tenant
tenantRouter.post("/login",verifyToken, loginInTenant)


//--DYNAMIC PATHS

//**Get tenant all data
tenantRouter.get("/:tenantId", verifyToken, getTenantData);

module.exports = tenantRouter;
