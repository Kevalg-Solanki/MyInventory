//middlewares
const validateRequest = require("../../middlewares/validateRequest");
const verifyToken = require("../../middlewares/verifyToken");


//controllers
const { updateUser } = require("./user.controller");



//validator
const { updateUserSchema } = require("./user.validation");


//create router
const userRouter = require("express").Router();


//APIs
userRouter.patch("/:userId",verifyToken,validateRequest(updateUserSchema),updateUser);


module.exports = userRouter;