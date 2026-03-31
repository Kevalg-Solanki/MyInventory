//External modules
const mongoose = require("mongoose");

const tenantSchema = new mongoose.Schema(
	{
		ownerId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		tenantLogo: {
			type: String,
			trim: true,
		},
		tenantName: {	
			type: String,
			unique: true,
			required: true,
			maxlength: [100, "Maximum length of tenant name exceeded"],
		},
		tenantSlogan: {
			type: String,
			maxlength: [200, "Maximum length of tenant slogan exceeded"],
		},
		tenantCategory: {
			type: String,
			required: true,
			trim: true,
		},
		businessEmail: {
			type: String,
			trim: true,
			lowercase: true,
			maxlength: 254,
		},
		gstNumber: {
			type: String,
			trim: true,
		},
		longitude: {
			type: Number,
			min: [-180, "Longitude must be >= -180"],
			max: [180, "Longitude must be <= 180"],
		},
		latitude: {
			type: Number,
			min: [-90, "Latitude must be >= -90"],
			max: [90, "Latitude must be <= 90"],
		},
		street: {
			type: String,
			required: true,
			minlength: [2, "Street name is to short"],
			maxlength: [30, "Street name length limit exceeded"],
		},
		landmark: {
			type: String,
			required: true,
			minlength: [2, "Landmark name is to short"],
			maxlength: [70, "Landmark name length limit exceeded"],
		},
		city: {
			type: String,
			required: true,
			minlength: [2, "City name is to short"],
			maxlength: [30, "City name length limit exceeded"],
		},
		state: {
			type: String,
			required: true,
			minlength: [2, "State name is to short"],
			maxlength: [30, "State name length limit exceeded"],
		},
		country: {
			type: String,
			required: true,
			minlength: [2, "Country name is to short"],
			maxlength: [50, "Country name length limit exceeded"],
		},
		zip: {
			type: String,
			required: true,
			minlength: [2, "Zip code is to short"],
			maxlength: [12, "Zip code length limit exceeded"],
		},
		isDeleted: {
			type: Boolean,
			default: false,
		},
		isActive: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

//keep tenant name unquie but ignore deleted tenants
tenantSchema.index({
	unique: true,
	partialFilterExpression: { isDeleted: { $ne: true } },
});

tenantSchema.index({ ownerId: 1 });

tenantSchema.set("toJSON", {
	transform(doc, ret) {
		delete ret.__v;
		return ret;
	},
});

const TenantModel = mongoose.model("Tenant", tenantSchema);

module.exports = {
	TenantModel,
};
