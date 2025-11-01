//external module
const Jwt = require("jsonwebtoken");

function generateAccessToken(payload) {
	return Jwt.sign(payload, process.env.JWT_SECRETE, {
		expiresIn: process.env.JWT_ACCESS_TOKEN_EXPIRY,
	});
}

function generateRefreshToken(payload) {
	return Jwt.sign(payload, process.env.JWT_SECRETE, {
		expiresIn: process.env.JWT_REFRESH_TOKEN_EXPIRY,
	});
}

module.exports = {
	generateAccessToken,
	generateRefreshToken,
};
