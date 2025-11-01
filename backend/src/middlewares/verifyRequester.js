
//constants
const { ID_ERROR, USER_ERROR } = require("../constants");

//utils
const { isValidObjectId } = require("../utils");
const throwAppError = require("../utils/throwAppError");



async function verifyIsSelf(req,res,next){
    try
    {
        const {userId} = req.params;
        const userIdFromToken = req.user._id;

        if(!userId) return next(throwAppError(USER_ERROR.USER_NOT_FOUND));

        if(!isValidObjectId(userId)) return next(throwAppError(ID_ERROR.OBJECTID_INVALID));

   
    }
    catch(error)
    {
        return next(error);
    }
}


module.exports = {
    verifyIsSelf
}