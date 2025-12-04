module.exports = {
    //400
   

    //404
    REQUEST_NOT_FOUND:{
        code:"REQUEST_NOT_FOUND",
        httpStatus:409,
        message:"Request not found."
    },
    //409
    REQUEST_ALREADY_SENT:{
        code:"REQUEST_ALREADY_SEND",
        httpStatus:409,
        message:"Request already sent. Cancel pending request if resend required."
    },
     REQUEST_ALREADY_CANCELLED:{
        code:"REQUEST_ALREADY_CANCELLED",
        httpStatus:409,
        message:"Request cancelled."
    },
    REQUEST_ALREADY_REJECTED:{
        code:"REQUEST_ALREADY_REJECTED",
        httpStatus:409,
        message:"Request is already rejected."
    },
    REQUEST_ALREADY_ACCEPTED:{
        code:"REQUEST_ALREADY_ACCEPTED",
        httpStatus:409,
        message:"Request is already accepted."
    },
}