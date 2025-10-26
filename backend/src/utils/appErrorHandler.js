class AppError extends Error
{
    /**
     * 
     * @param {string} message - user friendly message
     * @param {string} code - error code
     * @param {number} httpStatus - status
     */
    constructor(message, code, httpStatus = 400){
        super(message);
        this.code = code;
        this.httpStatus = httpStatus;
    }
}

module.exports = AppError;