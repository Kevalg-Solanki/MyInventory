//middlewares
const verifyToken = require("../../middlewares/verifyToken");



//create router
const requestRouter = require("express").Router();


//**GET request of user */
requestRouter.get("/me",verifyToken)


