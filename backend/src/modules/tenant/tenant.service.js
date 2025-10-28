//models
const { TenantModel } = require("./tenant.model");

//constants
const ERROR = require("../../constants/tenant.js");

//utiles
const AppError = require("../../utils/appErrorHandler");
const { UserModel } = require("../user/user.model.js");
const { findByIdAndUpdate } = require("../otp/otp.model.js");

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

// /**
//  *
//  * @param {string} userId - Id of user to update
//  * @param {Object} updateData - Data to update
//  * @returns {Object} - User data if updated
//  */

// const updateUserById = async (userId, updateData) => {
// 	const updatedUser = await UserModel.findByIdAndUpdate(
// 		{ _id: userId },
// 		{ $set: updateData },
// 		{ new: true, runValidators: true }
// 	);

// 	return updatedUser;
// };

/**
 *
 * @param {string} tenantName - tenant name to check
 * @returns
 */

//create tenant service
const checkTenantNameTaken = async (tenantName) => {
	//find tenant
	const tenantInDatabase = await findTenantByName(tenantName);

	//if tenant found in databaes
	if (tenantInDatabase) {
		error = ERROR.TENANT_NAME_TAKEN;
		throw new AppError(error?.message, error?.code, error?.httpStatus);
	}

	//if does not exist then return
	return false;
};

/**
 *
 * @param {string} userId - user id of owner
 * @param {Object} tenantData - tenant data to save
 * @returns
 */
const saveNewTenantInDatabaseByUserId = async (userId, tenantData) => {
	//create tenant model object to save
	const tenantModelToSave = new TenantModel({
		ownerId: userId,
		tenantLogo: tenantData?.tenantLogo,
		tenantName: tenantData?.tenantName,
		tenantSlogan: tenantData?.tenantSlogan,
		tenantCategory: tenantData?.tenantCategory,
		businessEmail: tenantData?.businessEmail,
		gstNumber: tenantData?.gstNumber,
		longitude: tenantData?.longitude,
		latitude: tenantData?.latitude,
		street: tenantData?.street,
		landmark: tenantData?.landmark,
		city: tenantData?.city,
		state: tenantData?.state,
		country: tenantData?.country,
		zip: tenantData?.zip,
	});

	//save tenant in database
	const savedTenantInDatabase = await tenantModelToSave.save();

	return savedTenantInDatabase;
};

/**
 *
 * @param {Object} userData - data of user to assing tenant
 * @param {ObjectId} tenantId - id to add to user
 * @returns
 */

const addTenantIdInUser = async (userData, tenantId) => {
	let tenants = userData.tenants;
	let tenantIdFound = false;

	//check user already have tenantId
	tenantIdFound = tenants.includes(tenantId);

	//return error if have
	if (tenantIdFound) {
		error = ERROR.TENANT_ALREADY_CONNECTED_USER;
		throw new AppError(error?.message, error?.code, error?.httpStatus);
	}

	//if not tenant id not exist than add to user
	const updatedUser = await UserModel.findByIdAndUpdate(
		{ _id: userData._id },
		{ $set: { tenants: [...tenants, tenantId] } },
		{ new: true, runValidators: true }
	);

	return updatedUser;
};

const setupDefaultTenantRoleAndAssignToUser = async (userId, tenantId) => {

    //create role for tenant
    const roleToSave = {
        tenantId,
        roleName:"Owner",
        

    }
};

module.exports = {
	checkTenantNameTaken,
	saveNewTenantInDatabaseByUserId,
	addTenantIdInUser,
	setupDefaultTenantRoleAndAssignToUser,
};
