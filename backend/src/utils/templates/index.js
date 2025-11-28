//this only used for importing and exporting. used for easy import of templates
module.exports = {
    
    //Auth
    verifyCredentialOtp:require("./verifyCredentialOtpEmailTemplate"),
    forgotPassOtp: require("./forgotPassOtpEmailTemplate"),

    //Tenant
    platformInvite:require("./platformInviteEmailTemplate"),

    tenantInvite:require("./tenantInviteEmailTemplate"),
    tenantDeactivation:require("./tenantDeactivationEmailTemplate"),
    tenantDelete:require("./tenantDeletedEmailTemplate"),

    //User
    userDeactivation:require("./userDeactivationEmailTemplate"),

}