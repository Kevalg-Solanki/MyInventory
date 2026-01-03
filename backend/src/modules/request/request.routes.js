//constants
const PERMS_SET = require("../../constants/permSets");

//middlewares
const verifyRolePermission = require("../../middlewares/verifyRolePermission");
const verifyToken = require("../../middlewares/verifyToken");

const requestControllers = require("./request.controller");

//create router
const requestRouter = require("express").Router();

//**GET request of user */
requestRouter.get(
	"/me",
	verifyToken,
	requestControllers.getAllActiveRequestOfUser
);

//**PATCH accept request */
requestRouter.patch(
	"/:requestId/accept",
	verifyToken,
	requestControllers.acceptRequest
);

//**PATCH reject request */
requestRouter.patch(
	"/:requestId/reject",
	verifyToken,
	requestControllers.rejectRequest
);


//**PATCH cancel invite request sent by self(member) from tenant  */
requestRouter.patch(
	"/:tenantId/cancel-mine/:requestId",
	verifyToken,
	verifyRolePermission(PERMS_SET.REQUEST_CANCEL_SELF_TENANT_INVITE_PERMS),
	requestControllers.rejectRequest
);




module.exports = requestRouter;
