//middlewares
const validateRequest = require("../../middlewares/validateRequest");

//validations
const { verifyCredentialSchema, verifyOtpRegisterSchema, registrationSchema, loginSchema } = require("./auth.validation.js");

//controllers
const { verifyCredentialAndSendOtp, verifyOtpForRegistration,register, login } = require("./auth.controller.js");


//create router
const authRouter = require("express").Router();

//APIs

//**Registration Api**
//step 1
authRouter.post("/verify-credential",validateRequest(verifyCredentialSchema),verifyCredentialAndSendOtp
);

//step 2
authRouter.post("/verify-otp-register",validateRequest(verifyOtpRegisterSchema),verifyOtpForRegistration)

//step 3
authRouter.post("/register",validateRequest(registrationSchema),register);


//**Login**
authRouter.post("/login",validateRequest(loginSchema),login);






module.exports = authRouter;

