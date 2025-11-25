//constants
const PERMS_SET = require("../../constants/permSets");

//middlewares
const verifyRolePermission = require("../../middlewares/verifyRolePermission");
const verifyToken = require("../../middlewares/verifyToken");
const validateRequest = require("../../middlewares/validateRequest");

//validators
const memberValidators = require("./tenantMember.validation");

//controllers
const memberControllers = require("./tenantMember.controller");

//create controller
const tenantMemberRouter = require("express").Router();

//**Sent invite to platform and also to tenant
tenantMemberRouter.post(
	"/:tenantId/invite-platform",
	verifyToken,
	verifyRolePermission(PERMS_SET.REQUEST_SEND_PLATFORM_INVITE_PERMS),
    validateRequest(memberValidators.inviteToPlatformSchema),
	memberControllers.inviteUserToPlatformAndTenant
);

//

module.exports = tenantMemberRouter;
