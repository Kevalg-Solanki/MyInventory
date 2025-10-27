module.exports = (res,statusCode,message,data={})=>{
    console.log(data)
    return res.status(statusCode).json({
        success: statusCode < 400,
        statusCode,
        message,
        data
    })
}