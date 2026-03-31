//middlewares
const validateRequest = require("../../middlewares/validateRequest");
const verifyToken = require("../../middlewares/verifyToken");
const {verifyIsSelf} = require("../../middlewares/verifyRequester");

//controllers
const userControllers = require("./user.controller");


//validator
const userValidators = require("./user.validation");


//create router
const userRouter = require("express").Router();


//APIs

//**Update user 
userRouter.patch("/:userId",verifyToken,validateRequest(userValidators.updateUserSchema),verifyIsSelf,userControllers.updateUser);

//**Deactivate user
userRouter.patch("/deactivate/:userId",verifyToken,verifyIsSelf,userControllers.deactivateUser);

//**Update user settings
userRouter.patch("/:userId/settings",verifyToken,validateRequest(userValidators.updateUserSettingSchema),verifyIsSelf,userControllers.updateUserSettings);


module.exports = userRouter;