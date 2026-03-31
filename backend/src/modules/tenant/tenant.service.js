//external modules
const mongoose = require("mongoose");
const { ObjectId } = require("mongodb");
const { DateTime } = require("luxon");

//models
const { TenantModel } = require("./tenant.model");
const { UserModel } = require("../user/user.model.js");
const { TenantRoleModel } = require("../tenantRole/tenantRole.model.js");
const { TenantMemberModel } = require("../tenantMember/tenantMember.model.js");

//constants
const { TENANT_ERROR, CRUD_ERROR, AUTH_ERROR } = require("../../constants");
const { MESSAGE_TYPE } = require("../../constants/messageType.js");
const ROLE_PRESETS = require("../../constants/rolesPresets.js");

//repositories
const {
	fetchTenantDataById,
} = require("../../repositories/tenant.repository.js");

//utiles
const { sendMail } = require("../../utils/emailService.js");
const { sendSms } = require("../../utils/smsService.js");
const throwAppError = require("../../utils/throwAppError.js");
const { convertStrToObjectId } = require("../../utils");

/**
 * @param {string} tenantName - Name of tenant to find
 * @returns {Object} - object or null if not found
 */
async function findTenantByName(tenantName) {
	return await TenantModel.findOne({
		tenantName,
		isDeleted: false,
	});
}

function removeRestrictedFields(restrictedFields, data) {
	//check is it restricted field
	for (const field of Object.keys(data)) {
		if (restrictedFields.has(field)) {
			//remove that field if it is
			delete data[field];
		}
	}
	return data;
}

/**
 * @param {string} tenantName - tenant name to check
 * @returns - throw error or return true
 */

//create tenant service
async function checkTenantNameTaken(tenantName) {
	//find tenant
	const tenantInDatabase = await findTenantByName(tenantName);

	//if tenant found in databaes
	if (tenantInDatabase) {
		throwAppError(TENANT_ERROR.TENANT_NAME_TAKEN);
	}

	//if does not exist then return
	return false;
}

/**
 * Create tenant service
 * save new tenant with user id in database
 * @param {string} userId - user id of owner
 * @param {Object} tenantData - tenant data to save
 * @param {Object} session - DB session
 * @returns {Object} - saved tenant id
 */

async function saveNewTenantInDatabaseByUserId(userId, tenantData, session) {
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
	//passs session to the Db save query
	return await tenantModelToSave.save({ session });
}

/**
 * Create tenant service
 * push new tenant id into user
 * @param {Object} userData - data of user to assing tenant
 * @param {ObjectId} tenantId - id to add to user
 * @returns {Object} - updated user data
 */

async function addTenantIdInUser(userData, tenantId, session) {
	//return error if have
	if (userData.tenants?.includes(tenantId)) {
		throwAppError(TENANT_ERROR.TENANT_ALREADY_CONNECTED_USER);
	}

	//if not tenant id not exist than add to user
	const updatedUser = await UserModel.findByIdAndUpdate(
		{ _id: userData._id },
		{ $addToSet: { tenants: tenantId } },
		{ new: true, runValidators: true, session }
	);

	return updatedUser;
}

/**
 * Create tenant service
 *
 * @param {Object} userData - requester user data
 * @param {ObjectId} tenantId - tenant id to setup default role
 * @returns - throw error or return true
 */
async function setupDefaultTenantRoleAndAssignToUser(
	userData,
	tenantId,
	session
) {
	//create role for tenant
	const roleToSave = new TenantRoleModel({
		tenantId,
		roleName: "Owner",
		permissions: [...ROLE_PRESETS.OWNER],
		numberOfUserAssigned:1
	});

	//save to database
	const savedOwnerRole = await roleToSave.save({ session });

	//create tenant member and assign role if of Owner role which is just created.
	const tenantMemberToSave = new TenantMemberModel({
		userId: userData?._id,
		tenantId,
		nickName: `${userData?.firstName} ${userData?.lastName}`,
		roles: [savedOwnerRole?._id],
	});

	const savedMember = await tenantMemberToSave.save({ session });

	return { savedOwnerRole, savedMember };
}

/**
 * Create tenant service
 * create default roles for tenants
 * @param {ObjectId} tenantId - id of tenant to create default role for it
 * @returns - throw error or return true
 */
async function setupDefaultTanantRoles(tenantId, session) {
	try {
		//create role for tenan
		const defaultRoleToSave1 = new TenantRoleModel({
			tenantId,
			roleName: "Co-Owner",
			permissions: [...ROLE_PRESETS.CO_OWNER],
		});

		const defaultRoleToSave2 = new TenantRoleModel({
			tenantId,
			roleName: "Admin",
			permissions: [...ROLE_PRESETS.ADMIN],
		});

		const defaultRoleToSave3 = new TenantRoleModel({
			tenantId,
			roleName: "Member",
			permissions: [...ROLE_PRESETS.MEMBER],
		});

		//save to database
		const [savedRole1, savedRole2, savedRole3] = await Promise.all([
			defaultRoleToSave1.save({ session }),
			defaultRoleToSave2.save({ session }),
			defaultRoleToSave3.save({ session }),
		]);

		return { savedRole1, savedRole2, savedRole3 };
	} catch (error) {
		throw error;
	}
}

//-----------------------------------------
//Create tenant and its defaults
async function createAndSetupTenantForUser(userData, tenantData) {
	//start session
	//session will used for executting all the db operation ensurring all success full or
	//if one fails then all previously save undo which avoid issues
	//session will pass to all db write query
	const session = await mongoose.startSession();
	try {
		const result = await session.withTransaction(async () => {
			//check any tenant with same name exist
			await checkTenantNameTaken(tenantData?.tenantName);

			//if tenant name is not taken then
			//create tenant
			const savedTenant = await saveNewTenantInDatabaseByUserId(
				userData._id,
				tenantData,
				session
			);

			//save tenant id in user document
			await addTenantIdInUser(userData, savedTenant?._id, session);

			//create default tenant role "Owner" and assign to user
			await setupDefaultTenantRoleAndAssignToUser(
				userData,
				savedTenant?._id,
				session
			);

			//create other preloaded roles
			await setupDefaultTanantRoles(savedTenant?._id, session);

			return savedTenant?._id;
		});

		//if everything done then returen tenantId
		return result;
	} catch (error) {
		throw error;
	} finally {
		await session.endSession();
	}
}

//GET tenant/mine--------------------------

async function getUserConnectedTenantsAndRoleData(userId, tenantIds) {
	try {
		const pipeline = [
			//first get tenants using tenant ids
			{ $match: { _id: { $in: tenantIds }, isDeleted: false } },
			//filter only needed fields
			{
				$project: {
					tenantName: 1,
					tenantLogo: 1,
					tenantCategory: 1,
					city: 1,
					state: 1,
					country: 1,
					isActive: 1,
				},
			},
			{
				$lookup: {
					from: "tenant-members",
					let: { tenantId: "$_id" },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ["$tenantId", "$$tenantId"] },
										{ $eq: ["$userId", userId] },
									],
								},
							},
						},
						{
							$project: { roles: 1, _id: 0 },
						},
					],
					as: "membership",
				},
			},
			{
				$unwind: { path: "$membership", preserveNullAndEmptyArrays: true },
			},
			{
				$lookup: {
					from: "tenant-roles",
					localField: "membership.roles",
					foreignField: "_id",
					as: "roleDocs",
				},
			},
			{
				$project: {
					tenantId: "$_id",
					tenantName: 1,
					tenantCategory: 1,
					city: 1,
					state: 1,
					country: 1,
					tenantLogo: 1,
					roles: {
						$cond: [
							{ $gt: [{ $size: "$roleDocs" }, 0] }, //condition (gt = greater than)
							{
								//if
								$map: {
									input: "$roleDocs",
									as: "r",
									in: "$$r.roleName",
								},
							},
							[], //else
						],
					},
				},
			},
		];

		return await TenantModel.aggregate(pipeline);
	} catch (error) {
		throw error;
	}
}

async function getUserTenantAndRoleDataById(userId, tenantId) {
	try {
		const pipeline = [
			//first get tenants using tenant ids
			{ $match: { _id: tenantId, isDeleted: false, isActive: true } },
			//filter only needed fields
			{
				$project: {
					tenantName: 1,
					tenantLogo: 1,
					tenantCategory: 1,
					tenantSlogan: 1,
					city: 1,
					state: 1,
					country: 1,
					isActive: 1,
				},
			},
			{
				$lookup: {
					from: "tenant-members",
					let: { tenantId: "$_id" },
					pipeline: [
						{
							$match: {
								$expr: {
									$and: [
										{ $eq: ["$tenantId", "$$tenantId"] },
										{ $eq: ["$userId", userId] },
									],
								},
							},
						},
						{
							$project: { nickName: 1, isActive: 1, roles: 1, _id: 0 },
						},
					],
					as: "membership",
				},
			},
			{
				$unwind: { path: "$membership", preserveNullAndEmptyArrays: true },
			},
			{
				$lookup: {
					from: "tenant-roles",
					localField: "membership.roles",
					foreignField: "_id",
					as: "roleDocs",
				},
			},
			{
				$project: {
					tenantId: "$_id",
					tenantName: 1,
					tenantLogo: 1,
					tenantCategory: 1,
					tenantSlogan: 1,
					city: 1,
					state: 1,
					country: 1,
					roles: {
						$cond: [
							{ $gt: [{ $size: "$roleDocs" }, 0] }, //condition (gt = greater than)
							{
								//if
								$map: {
									input: "$roleDocs",
									as: "r",
									in: "$$r.roleName",
								},
							},
							[], //else
						],
					},
				},
			},
		];

		return await TenantModel.aggregate(pipeline);
	} catch (error) {
		throw error;
	}
}

//Get tenant data by id
async function getTenantsConnectedToUserById(userData) {
	//get tenants id stored in user document

	const tenantIds = userData?.tenants;

	const tenantLists = await getUserConnectedTenantsAndRoleData(
		userData?._id,
		tenantIds
	);

	return tenantLists;
}

//Login user into tenant
async function loginUserIntoTenant(userId, tenantId) {
	//convert tenant id to Ojbect id
	const convertedId = await convertStrToObjectId(tenantId);

	//get tenant basic data and user's membership details and roles id
	const tenantAndRoleData = await getUserTenantAndRoleDataById(
		userId,
		convertedId
	);

	//if no tenant found by id
	if (tenantAndRoleData.length < 1) {
		throwAppError(TENANT_ERROR.TENANT_NOT_FOUND);
	}

	return tenantAndRoleData;
}

//Update tenant data
async function updateTenantData(tenantId, tenantData) {
	//remove restricted fields
	const restrictedFields = new Set([
		"_id",
		"ownerId",
		"createdAt",
		"updatedAt",
		"isDeleted",
		"isActive",
	]);

	const newTenantData = await removeRestrictedFields(
		restrictedFields,
		tenantData
	);

	if (Object.keys(newTenantData).length === 0) {
		throwAppError(CRUD_ERROR.UPDATABLE_FIELDS_MISSING);
	}

	//update
	const updatedTenant = await TenantModel.findOneAndUpdate(
		{ _id: tenantId, isDeleted: false, isActive: true },
		{ $set: newTenantData },
		{ new: true }
	);

	if (!updatedTenant) {
		throwAppError(TENANT_ERROR.TENANT_NOT_FOUND);
	}

	return updatedTenant;
}

//deactivate tenant and notify owner
async function deactivateTenantAndNotifyOwner(tenanId, userData) {
	try {
		//check tenant deactivated
		const tenantData = await fetchTenantDataById(tenanId);

		if (!tenantData?.isActive) {
			throwAppError(TENANT_ERROR.TENANT_DEACTIVATED);
		}

		//check requested by owner
		if (tenantData.ownerId.toString() != userData._id.toString()) {
			throwAppError(AUTH_ERROR.UNAUTHORIZED_ACCESS);
		}

		//deactivate tenant
		tenantData.isActive = false;
		await tenantData.save();
		// [[tenantName]], [[tenantId]], [[reason]], [[actedByName]], [[actedByEmail]], [[deactivatedAt]], [[reactivationWindowHours]]

		const { tenantName, tenantId } = tenantData;

		const actedByName = `${userData.firstName} ${userData.lastName}`;
		const actedByEmail = userData?.email ? userData?.email : "-";
		const actedByMobile = userData?.mobile ? userData?.mobile : "-";
		const deactivatedAt = DateTime.now()
			.setZone("Asia/Kolkata")
			.toFormat("h:mm a MM/dd/yyyy");
		const reactivationWindowHours = "(No limit)";

		//notify owner for deactivations
		if (userData?.email) {
			await sendMail(MESSAGE_TYPE.TENANT_DEACTIVATED_MSG, userData?.email, {
				tenantName,
				tenantId,
				actedByName,
				actedByEmail,
				actedByMobile,
				deactivatedAt,
				reactivationWindowHours,
			});
		} else if (userData?.mobile) {
			await sendSms(MESSAGE_TYPE.TENANT_DEACTIVATED_MSG, userData?.mobile, {
				tenantName,
			});
		}
	} catch (error) {
		throw error;
	}
}

async function deleteTenantAndNotifyOwner(tenanId, userData) {
	try {
		//check tenant deactivated
		const tenantData = await fetchTenantDataById(tenanId);

		if (tenantData?.isDeleted) {
			throwAppError(TENANT_ERROR.TENANT_DELETED);
		}

		//check requested by owner
		if (tenantData.ownerId.toString() != userData._id.toString()) {
			throwAppError(AUTH_ERROR.UNAUTHORIZED_ACCESS);
		}

		//delete tenant
		tenantData.isDeleted = true;
		await tenantData.save();
		// [[tenantName]], [[tenantId]], [[reason]], [[actedByName]], [[actedByEmail]], [[deactivatedAt]], [[reactivationWindowHours]]

		const { tenantName, _id } = tenantData;

		const actedByName = `${userData.firstName} ${userData.lastName}`;
		const actedByEmail = userData?.email ? userData?.email : "-";
		const actedByMobile = userData?.mobile ? userData?.mobile : "-";
		const deletedAt = DateTime.now()
			.setZone("Asia/Kolkata")
			.toFormat("h:mm a MM/dd/yyyy");
		const reactivationWindowHours = "(Currently Not limited)";

		//notify owner for deactivations
		if (userData?.email) {
			await sendMail(MESSAGE_TYPE.TENANT_DELETED_MSG, userData?.email, {
				tenantName,
				tenantId: _id,
				actedByName,
				actedByEmail,
				actedByMobile,
				deletedAt,
				reactivationWindowHours,
			});
		} else if (userData?.mobile) {
			await sendSms(MESSAGE_TYPE.TENANT_DELETED_MSG, userData?.mobile, {
				tenantName,
			});
		}
	} catch (error) {
		throw error;
	}
}

module.exports = {
	checkTenantNameTaken,
	saveNewTenantInDatabaseByUserId,
	addTenantIdInUser,
	setupDefaultTenantRoleAndAssignToUser,
	setupDefaultTanantRoles,
	createAndSetupTenantForUser,
	fetchTenantDataById,
	getTenantsConnectedToUserById,
	loginUserIntoTenant,
	updateTenantData,
	deactivateTenantAndNotifyOwner,
	deleteTenantAndNotifyOwner,
};
