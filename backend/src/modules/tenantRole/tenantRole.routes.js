
//controllers
const { getTenantAllRoleListWithoutPerms } = require("./tenantRole.controller");

//constants
const PERMS_SET = require("../../constants/permSets");

//middlewares
const verifyRolePermission = require("../../middlewares/verifyRolePermission");
const verifyToken = require("../../middlewares/verifyToken");

//crete controller
const tenantRoleRouter = require("express").Router();


//**Get all roles
tenantRoleRouter.get(
	"/:tenantId",
	verifyToken,
	verifyRolePermission(PERMS_SET.ROLE_GET_ALL_PERMS),
    getTenantAllRoleListWithoutPerms
);

module.exports = tenantRoleRouter;
