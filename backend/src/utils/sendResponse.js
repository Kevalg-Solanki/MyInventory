module.exports = (res,statusCode,message,data={})=>{

    return res.status(statusCode).json({
        success: statusCode < 400,
        statusCode,
        message,
        data
    })
}