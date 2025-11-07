//External modules
const mongoose = require("mongoose");


const tenantRoleSchema = new mongoose.Schema(
    {
        tenantId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Tenant",
            required: true,
        },
        roleName: {
            type: String,
            default:"new role",
            maxlength: [30,"Role name maximum character limit exceeded"],
        },
        roleColor: {
            type: String,
            maxlength:[7,"unknown color"],
            default:"#000000"
        },
        numberOfUserAssigned:{
            type: Number,
            default:0
        },
        permissions:[
            {
                type:String
            }
        ],
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



tenantRoleSchema.index(
    {tenantId:1,roleName:1},
    {unique:true, partialFilterExpression:{isDeleted:{$ne:true}}}
);

tenantRoleSchema.index({tenantId:1,isDeleted:1});


const TenantRoleModel = mongoose.model("Tenant-Role", tenantRoleSchema);

module.exports = {
    TenantRoleModel,
};
