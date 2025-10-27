//models
const { TenantModel } = require("./tenant.model");

//constants
const ERROR = require("../../constants/tenant.js");

//utiles
const AppError = require("../../utils/appErrorHandler");


//global variable
let error;


/**
 * 
 * @param {string} tenantName - Name of tenant to find
 * @returns {Object} - object or null if not found
 */
const findTenantByName = async (tenantName) => {

	return await TenantModel.findOne({
		tenantName: tenantName,
		isDeleted: false,
	});
};


/**
 * 
 * @param {string} tenantName - tenant name to check
 * @returns 
 */

//create tenant service
const checkTenantNameTaken = async(tenantName) =>{

    //find tenant
    const tenantInDatabase = await findTenantByName(tenantName);

    //if tenant found in databaes
    if(tenantInDatabase)
    {
        error = ERROR.TENANT_NAME_TAKEN;
        throw new AppError(error?.message,error?.code,error?.httpStatus);
    }

    //if does not exist then return 
    return false;
}

module.exports = {
    checkTenantNameTaken
}