const { TenantRoleModel } = require("../modules/tenantRole/tenantRole.model");
const { convertStrToObjectId } = require("../utils");


async function saveCustomTenantRole(tenantRoledData){

	const tenantRoleToSave = new TenantRoleModel(tenantRoledData);

	return await tenantRoleToSave.save();
}



async function findAndCombinePermsFromAllRolesByRoleIds(roleIds) {
	const pipeline = [
		{ $match: { _id: { $in: roleIds }, isDeleted: false, isActive: true } },
		{
			$project: {
				permissions: 1,
				_id: 0, //exclude _id which by default included
			},
		},
		//make different documents for each permission array with $unwind
		{ $unwind: { path: "$permissions", preserveNullAndEmptyArrays: false } },
		//group all array into one and $addToSet only preserv unquie so not duplicate permissions
		{ $group: { _id: null, permissions: { $addToSet: "$permissions" } } },
		//get flat array
		{
			$project: {
				_id: 0,
				permissions: 1,
			},
		},
	];

	const permsDocs = await TenantRoleModel.aggregate(pipeline);

	return permsDocs[0].permissions;
}

/**
 *
 * @param {string} tenantId
 * @returns {Array} - null or array of objects
 */
async function findAllRolesWithoutPermsByTenantId(tenantId) {
	const convertedId = await convertStrToObjectId(tenantId);

	return await TenantRoleModel.find(
		{ tenantId: convertedId, isDeleted: false },
		{ roleName: 1, roleColor: 1, numberOfUserAssigned: 1, _id: 1 }
	).lean();
}

/**
 *
 * @param {string} tenantId
 * @returns {Array} - null or array of objects
 */
async function findAllRolesWithPermsByTenantId(tenantId) {
	const convertedId = await convertStrToObjectId(tenantId);

	return await TenantRoleModel.find(
		{ tenantId: convertedId, isDeleted: false },
		{
			roleName: 1,
			roleColor: 1,
			numberOfUserAssigned: 1,
			_id: 1,
			permissions: 1,
		}
	).lean();
}

/**
 * @param {string} tenantId
 * @param {string} roleId
 * @returns {Object} - null or document
 */
async function findRoleDetailsWithoutPermsByIds(tenantId, roleId) {
	const convertedRoleId = await convertStrToObjectId(roleId);
	const convertedTenantId = await convertStrToObjectId(tenantId);

	return await TenantRoleModel.find(
		{ _id: convertedRoleId, tenantId: convertedTenantId, isDeleted: false },
		{ roleName: 1, roleColor: 1, numberOfUserAssigned: 1, _id: 1 }
	).lean();
}

/**
 *
 * @param {string} roleId
 * @returns {Object} - null or document
 */
async function findRoleDetailsWithPermsByIds(tenantId, roleId) {
	const convertedRoleId = await convertStrToObjectId(roleId);
	const convertedTenantId = await convertStrToObjectId(tenantId);

	return await TenantRoleModel.find(
		{ _id: convertedRoleId, tenantId: convertedTenantId, isDeleted: false },
		{
			roleName: 1,
			roleColor: 1,
			numberOfUserAssigned: 1,
			permissions: 1,
			_id: 1,
		}
	).lean();
}

/**
 *
 * @param {ArrayOfObjectIds} roleIds - array of roleIds
 * @param {Array} - null or array of object
 */
async function findRolesPermsByRoleIds(roleIds, withPerms = false) {
	
	let projectObj = {
		_id: 1,
		roleName: 1,
		roleColor: 1,
	};

	if (withPerms) {
		projectObj.permissions =1;
	}
	console.log(projectObj);

	const pipeline = [
		{ $match: { _id: { $in: roleIds }, isDeleted: false, isActive: true } },
		{
			$project: projectObj
		},
	];

	return await TenantRoleModel.aggregate(pipeline);
}


module.exports = {
	findAndCombinePermsFromAllRolesByRoleIds,
	findAllRolesWithoutPermsByTenantId,
	findAllRolesWithPermsByTenantId,
	findRoleDetailsWithoutPermsByIds,
	findRoleDetailsWithPermsByIds,
	findRolesPermsByRoleIds,
	saveCustomTenantRole
};
