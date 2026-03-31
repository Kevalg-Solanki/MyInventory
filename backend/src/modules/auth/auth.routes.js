//middlewares
const validateRequest = require("../../middlewares/validateRequest");
const verifyToken = require("../../middlewares/verifyToken.js");

//validations
const authValidators = require("./auth.validation.js");

//controllers
const authControllers = require("./auth.controller.js");

//create router
const authRouter = require("express").Router();

//APIs

//**Registration Api**
//step 1
authRouter.post(
	"/verify-credential",
	validateRequest(authValidators.verifyCredentialSchema),
	authControllers.verifyCredentialAndSendOtp
);

//step 2
authRouter.post(
	"/verify-otp-register",
	validateRequest(authValidators.verifyOtpRegisterSchema),
	authControllers.verifyOtpForRegistration
);

//step 3
authRouter.post(
	"/register",
	validateRequest(authValidators.registrationSchema),
	authControllers.register
);

//**Login**
authRouter.post(
	"/login",
	validateRequest(authValidators.loginSchema),
	authControllers.login
);

//**Refresh Token
authRouter.post("/refresh-token", authControllers.refreshToken);

//**Forgot Password

//step 1:
authRouter.post(
	"/forgot-password-request",
	validateRequest(authValidators.forgotPassRequestSchema),
	authControllers.forgotPassReq
);

//step 2:
authRouter.post(
	"/verify-otp-forgot-password",
	validateRequest(authValidators.verifyForgotPassOtpSchema),
	authControllers.verifyOtpForForgotPass
);

//step 3:
authRouter.patch(
	"/forgot-password",
	validateRequest(authValidators.forgotPassSchema),
	authControllers.forgotPassword
);

//**Reset Password
authRouter.patch(
	"/reset-password",
	validateRequest(authValidators.resetPassSchema),
	authControllers.resetPassword
);

//**get user data
authRouter.get("/me", verifyToken, authControllers.getUserDataById);

module.exports = authRouter;
