//constants
const PERMS_SET = require("../../constants/permSets");

//middlewares
const verifyRolePermission = require("../../middlewares/verifyRolePermission");
const verifyToken = require("../../middlewares/verifyToken");
const validateRequest = require("../../middlewares/validateRequest");

//validators

//controllers


//create controller
const tenantMemberRouter = require("express").Router();


//**Sent invite to platform
tenantMemberRouter.post("/invite-platform",verifyToken,)

// 


module.exports = tenantMemberRouter;
