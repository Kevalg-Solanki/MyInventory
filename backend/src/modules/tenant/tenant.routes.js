//middlewares
const validateRequest = require("../../middlewares/validateRequest");
const verifyToken = require("../../middlewares/verifyToken.js");

//validator
const { createTenantSchema } = require("./tenant.validation.js");


//create router
const tenantRouter = require("express").Router();


//APIs

//Create tenant 
tenantRouter.post("/",verifyToken,validateRequest(createTenantSchema),createTenant);


module.exports = tenantRouter;