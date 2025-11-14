//external modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

//creating express app
const app = express();

//routes
const authRouter = require("./modules/auth/auth.routes.js");
const tenantRouter = require("./modules/tenant/tenant.routes.js");
const userRouter = require("./modules/user/user.routes.js")

//--middlewares
//CORS
app.use(cors());

//Content-type gate to allow only JSON format
app.use((req, res, next) => {
	//skip for GET and HEAD methods
	if (req.method === "GET" || req.method === "HEAD") return next();

	//check is json format
	const isJson = req.is("application/json") || req.is("application/*+json");

	if (isJson) {
		return next();
	}

	return res.status(415).json({
		success: false,
		statusCode: 415,
		message: "Use Content-Type: application/json",
		code: "UNSUPPORTED_MEDIA_TYPE",
	});
});

app.use(bodyParser.json());

//LOGGER
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms")
);

//--ROUTES
app.use("/api/v1/auth", authRouter);

app.use("/api/v1/tenants", tenantRouter);

app.use("/api/v1/users", userRouter);



//Error handler
app.use((error, req, res, next) => {
	console.error("Error : ", error);
	res.status(error.httpStatus || 500).json({
		success: false,
		statusCode: error.httpStatus || 500,
		message:
			error.httpStatus >= 500 || !error.httpStatus
				? "Internal Server Error"
				: error.message || "Internal Server Error",
		code: error.code || "SERVER_ERROR",
	});
});


module.exports = app;
