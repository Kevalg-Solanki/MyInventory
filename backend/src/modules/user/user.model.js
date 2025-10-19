//External modules
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
	{
		profilePicture: { type: String },
		firstName: {
			type: String,
			required: true,
			index: "text",
		},
		lastName: {
			type: String,
			required: true,
			index: "text",
		},
		email: {
			type: String,
			trim: true,
			lowercase: true,
			unique: true,
			sparse: true,
			index: "text",
		},
		mobile: {
			type: String,
			trim: true,
			unique: true,
			sparse: true,
			index: "text",
		},
		tenants: [
			{
				tenantId: {
					type: mongoose.Schema.Types.ObjectId,
					ref: "Tenant",
				},
			},
		],
		password: {
			type: String,
			trim: true,
			required: [true, "Password is required"],
			minlength: [8, "Password must be at least 8 characters"],
		},
		isDeleted: {
			type: Boolean,
			required: true,
			default: false,
		},
		isActive: {
			type: Boolean,
			required: true,
			default: true,
		},
		isSuperAdmin: {
			type: Boolean,
			required: true,
			default: false,
		},
	},
	{ timestamps: true }
);

//Indexing
userSchema.index({ "tenants.tenantId": 1 });
userSchema.index({
	firstName: "text",
	lastName: "text",
	email: "text",
	mobile: "text",
});

module.exports = mongoose.model("User", userSchema);
