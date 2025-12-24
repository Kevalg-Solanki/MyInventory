//middlewares
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

module.exports = requestRouter;
