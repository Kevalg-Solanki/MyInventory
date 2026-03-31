const mongoose = require("mongoose");

const userSettingSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		displayPreferences: {
			theme: { type: String, enum: ["dark", "light"], default: "light" },
			saleSummary: {
				type: String,
				enum: ["none", "week", "month", "year"],
				default: "week",
			},
		},
		systemPreferences: {
			defaultCurrency: { type: String, default: "INR", required: true },
			locale: { type: String, default: "en-IN" },
			dateTimeFormat: {
				type: String,
				enum: ["DD/MM/YYYY", "MM/DD/YYYY", "YYYY/MM/DD"],
				default: "DD/MM/YYYY",
			},
			language: { type: String, default: "en-IN", required: true },
			numberFormat: {
				type: String,
				enum: ["none", "indian", "international"],
				default: "indian",
			},
		},
		businessInfos: {
			timezone: { type: String, default: "Asia/Kolkata", required: true },
		},
		notifications: {
			lowStockNotification: { type: Boolean, default: true, required: true },
		},
	},
	{ timestamps: true }
);

const UserSettingModel = mongoose.model("User-Settings", userSettingSchema);

module.exports = UserSettingModel;
