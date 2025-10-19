//middlewares
const validateRequest = require("../../middlewares/validateRequest");

//validations
const { verifyCredentialSchema, verifyOtpRegisterSchema, registrationSchema } = require("./auth.validation.js");

//controllers
const { verifyCredentialAndSendOtp, verifyOtpForRegistration,register } = require("./auth.controller.js");


//create router
const authRouter = require("express").Router();

//APIs

//step 1
authRouter.post("/verify-credential",validateRequest(verifyCredentialSchema),verifyCredentialAndSendOtp
);

authRouter.post("/verify-otp-register",validateRequest(verifyOtpRegisterSchema),verifyOtpForRegistration)

authRouter.post("/register",validateRequest(registrationSchema),register)

module.exports = authRouter;
