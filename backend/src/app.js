//external modules
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");

//creating express app
const app = express();

//middlewares
app.use(cors());
app.use(bodyParser.json());

//routes
const authRouter = require("./modules/auth/auth.routes.js");

//logging middleware
app.use(
	morgan(":method :url :status :res[content-length] - :response-time ms")
);

//--ROUTES
app.use("/api/v1/auth", authRouter);

//Error handler
app.use((error, req, res, next) => {
	console.error("Error : ", error);
	res.status(error.httpStatus || 500).json({
		success: false,
		statusCode: error.httpStatus | 500,
		message: error.message || "Internal Server Error",
		code: error.code || "SERVER_ERROR",
	});
});

module.exports = app;
