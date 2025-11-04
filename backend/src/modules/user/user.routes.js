//middlewares
const validateRequest = require("../../middlewares/validateRequest");
const verifyToken = require("../../middlewares/verifyToken");
const {verifyIsSelf} = require("../../middlewares/verifyRequester");

//controllers
const { updateUser,deactivateUser } = require("./user.controller");


//validator
const { updateUserSchema } = require("./user.validation");


//create router
const userRouter = require("express").Router();


//APIs

//**Update user 
userRouter.patch("/:userId",verifyToken,validateRequest(updateUserSchema),verifyIsSelf,updateUser);

//**Deactivate user
userRouter.patch("/deactivate/:userId",verifyToken,verifyIsSelf,deactivateUser);


userRouter.patch("/:userId/settings",verifyToken,verifyIsSelf,deactivateUser);


module.exports = userRouter;