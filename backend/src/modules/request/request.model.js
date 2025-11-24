const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
	{
		sender: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiver: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		receiverCredential: {
			type: String,
			trim: true,
			lowercase: true,
			required: true,
			maxlength: 254,
		},
		tenantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tenant",
			required: true,
		},
		type: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			enum: ["pending", "accepted", "rejected"],
			default: "pending",
			required: true,
		},
		title: {
			type: String,
			required: true,
			maxlength: 20,
		},
		message: {
			type: String,
			required: true,
			maxlength: 50,
		},
		isDeleted: {
			type: Boolean,
			default: false,
			required: true,
		},
		isActive: {
			type: Boolean,
			default: true,
			required: true,
		},
	},
	{ timestamps: true }
);


//Create compound unique index on the tenantId,receiver,receiverCredential
requestSchema.index({tenantId:1,receiver:1,receiverCredential:1},{unique:true});

requestSchema.index({receiver:1,isDeleted:1});

requestSchema.set("toJSON", {
	transform(doc, ret) {
		delete ret.__v;
		return ret;
	},
});

const RequestModel = mongoose.model("Request",requestSchema);

module.exports = {
    RequestModel
}
