//middlewares
const validateRequest = require("../../middlewares/validateRequest");
const verifyToken = require("../../middlewares/verifyToken");
const {verifyIsSelf} = require("../../middlewares/verifyRequester");

//controllers
const { updateUser,deactivateUser, updateUserSettings } = require("./user.controller");


//validator
const { updateUserSchema, updateUserSettingSchema } = require("./user.validation");


//create router
const userRouter = require("express").Router();


//APIs

//**Update user 
userRouter.patch("/:userId",verifyToken,validateRequest(updateUserSchema),verifyIsSelf,updateUser);

//**Deactivate user
userRouter.patch("/deactivate/:userId",verifyToken,verifyIsSelf,deactivateUser);

//**Update user settings
userRouter.patch("/:userId/settings",verifyToken,validateRequest(updateUserSettingSchema),verifyIsSelf,updateUserSettings);


module.exports = userRouter;