//middlewares
const validateRequest = require("../../middlewares/validateRequest");

//validations
const { verifyCredentialSchema, 
        verifyOtpRegisterSchema, 
        registrationSchema, 
        loginSchema,
        forgotPassRequestSchema,
        verifyForgotPassOtpSchema,
        forgotPassSchema,
        resetPassSchema
    } = require("./auth.validation.js");

//controllers
const { verifyCredentialAndSendOtp, 
        verifyOtpForRegistration,
        register,
        login,
        refreshToken,
        forgotPassReq,
        verifyOtpForForgotPass,
        forgotPassword,
        resetPassword,
        getUserDataById
    } = require("./auth.controller.js");
const verifyToken = require("../../middlewares/verifyToken.js");


//create router
const authRouter = require("express").Router();

//APIs

//**Registration Api**
//step 1
authRouter.post("/verify-credential",validateRequest(verifyCredentialSchema),verifyCredentialAndSendOtp);

//step 2
authRouter.post("/verify-otp-register",validateRequest(verifyOtpRegisterSchema),verifyOtpForRegistration)

//step 3
authRouter.post("/register",validateRequest(registrationSchema),register);


//**Login**
authRouter.post("/login",validateRequest(loginSchema),login);


//**Refresh Token
authRouter.post("/refresh-token",refreshToken)


//**Forgot Password

//step 1: 
authRouter.post("/forgot-password-request",validateRequest(forgotPassRequestSchema),forgotPassReq);

//step 2:
authRouter.post("/verify-otp-forgot-password",validateRequest(verifyForgotPassOtpSchema),verifyOtpForForgotPass);

//step 3:
authRouter.patch("/forgot-password",validateRequest(forgotPassSchema),forgotPassword);


//**Reset Password
authRouter.patch("/reset-password",validateRequest(resetPassSchema),resetPassword)


//**get user data
authRouter.get("/me",verifyToken,getUserDataById);


module.exports = authRouter;


