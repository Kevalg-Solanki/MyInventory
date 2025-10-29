//models
const { TenantModel } = require("./tenant.model");

//constants
const ERROR = require("../../constants/tenant.js");
const ROLE_PRESETS = require("../../constants/rolesPresets.js");

//utiles
const AppError = require("../../utils/appErrorHandler");
const { UserModel } = require("../user/user.model.js");
const { findByIdAndUpdate } = require("../otp/otp.model.js");
const { TenantRoleModel } = require("../tenantRole/tenantRole.model.js");
const { TenantMemberModel } = require("../tenantMember/tenantMember.model.js");

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
 * @returns - throw error or return true
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
 * @returns {Object} - saved tenant id
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
 * @returns {Object} - updated user data
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

/**
 *
 * @param {Object} userData - requester user data
 * @param {ObjectId} tenantId - tenant id to setup default role
 * @returns - throw error or return true
 */
const setupDefaultTenantRoleAndAssignToUser = async (userData, tenantId) => {
	//create role for tenan
	const roleToSave = new TenantRoleModel({
		tenantId,
		roleName: "Owner",
		permissions: [...ROLE_PRESETS.OWNER],
	});

	//save to database
	const savedOwnerRole = await roleToSave.save();

	//create tenant member and assign role if of Owner role which is just created.
	const tenantMemberToSave = new TenantMemberModel({
		userId: userData?._id,
		tenantId,
		nickName: `${userData?.firstName} ${userData?.lastName}`,
		roles: [savedOwnerRole?._id],
	});

	const savedMember = await tenantMemberToSave.save();

	return true;
};



/**
 * @param {ObjectId} tenantId - id of tenant to create default role for it
 * @returns - throw error or return true
 */
const setupDefaultTanantRoles = async (tenantId) => {
	try {
		//create role for tenan
		const defaultRoleToSave1 = new TenantRoleModel({
			tenantId,
			roleName: "Admin",
			permissions: [...ROLE_PRESETS.ADMIN],
		});

		const defaultRoleToSave2 = new TenantRoleModel({
			tenantId,
			roleName: "Member",
			permissions: [...ROLE_PRESETS.MEMBER],
		});

		//save to database
		await Promise.all([
			defaultRoleToSave1.save(),
			defaultRoleToSave2.save()
		]);

		return true;
	} catch (error) {
		throw error;
	}
};
module.exports = {
	checkTenantNameTaken,
	saveNewTenantInDatabaseByUserId,
	addTenantIdInUser,
	setupDefaultTenantRoleAndAssignToUser,
	setupDefaultTanantRoles
};
