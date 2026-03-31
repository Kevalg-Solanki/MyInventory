//External modules
const mongoose = require("mongoose");

const tenantMemberSchema = new mongoose.Schema(
	{
		userId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User",
			required: true,
		},
		tenantId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "Tenant",
			required: true,
		},
		nickName: {
			type: String,
			max: 20,
		},
		roles: [
			{
				type: mongoose.Schema.Types.ObjectId,
				ref: "Tenant-Role",
			},
		],
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
	},
	{ timestamps: true }
);


tenantMemberSchema.index(
    {userId:1,tenantId:1},
    {unique:true, partialFilterExpression:{isDeleted:{$ne:true}}}
);

tenantMemberSchema.index(
    {tenantId:1,roles:1},
    {unique:true, partialFilterExpression:{isDeleted:{$ne:true}}}
);

tenantMemberSchema.set("toJSON", {
	transform(doc, ret) {
		delete ret.__v;
		return ret;
	},
});

const TenantMemberModel = mongoose.model("Tenant-Member", tenantMemberSchema);

module.exports = {
	TenantMemberModel,
};
