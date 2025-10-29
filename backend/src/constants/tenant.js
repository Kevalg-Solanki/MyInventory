module.exports = {

    TENANT_NAME_TAKEN:{
        code:"TENANT_NAME_TAKEN",
        httpStatus:409,
        message:"This tenant name is already taken."
    },
    TENANT_ALREADY_CONNECTED_USER:{
        code:"TENANT_ALREADY_CONNECTED_USER",
        httpStatus:409,
        message:"User already connected to this tenant."
    },
    TENANT_INVALID_ID:{
        code:'TENANT_INVALID_ID',
        httpStatus:400,
        message:"Invalid tenant id. May be server error."
    }

}