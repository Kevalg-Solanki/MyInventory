//External modules
const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema(
	{
		type: {
			type: String,
			required: true,
			trim: true,
		},
		destination: {
			type: String,
			required: true,
			trim: true,
		},
		otp: {
			type: String,
			required: true,
		},
		expireIn: {
			type: String,
			required: true,
		},
	},
	{ timestamps: true }
);

//Indexing
otpSchema.index({ destination: 1, type: 1 });
otpSchema.index({ expireIn: 1 });

module.exports = mongoose.model("Otp", otpSchema);
