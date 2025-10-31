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
    },
    TENANT_NOT_FOUND:{
        code:"TENANT_NOT_FOUND",
        httpStatus:404,
        message:"Tenant not found."
    },
    TENANT_DEACTIVATED:{
        code:"TENANT_DEACTIVATED",
        httpStatus:403,
        message:"Tenant you trying to access is deactivated. Please visit recovery page by clicking recover tenant/account in singUp page."
    },
    TENANT_DELETED:{
        code:"TENANT_DELETED",
        httpStatus:410,
        message:"Tenant you trying to access is deleted or removed. Please visit recovery page by clicking recover tenant/account in singUp page."
    },
    TENANT_UNRECOGNIZED:{
        code:"TENANT_UNRECOGNIZED",
        httpStatus:404,
        message:"Tenant not found"
    }

}