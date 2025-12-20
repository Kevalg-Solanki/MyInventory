//models
const {
	TenantMemberModel,
} = require("../modules/tenantMember/tenantMember.model");

//utils
const utils = require("../utils");

/**
 * @param {stirng} tenantId
 * @param {string} tenantMemberId
 * @returns {object} - null if not found
 */
async function findTenantMemberByTenantAndMemberId(tenantId, tenantMemberId) {
	console.log(tenantMemberId, tenantId);
	if (!tenantId || !tenantMemberId) return null;
	const convertedMemberId = await utils.convertStrToObjectId(tenantMemberId);
	console.log(convertedMemberId);
	return await TenantMemberModel.findOne({
		_id: convertedMemberId,
		tenantId,
		isDeleted: false,
	});
}

/**
 * - Finding tenant member by userId,tenantId
 * @param {string} tenantId
 * @param {string} userId
 * @returns {Object} - null if not found
 */
async function findTenantMemberByIds(tenantId, userId) {
	if (!tenantId || !userId) return null;
	return await TenantMemberModel.findOne({
		tenantId,
		userId,
		isDeleted: false,
	});
}

/**
 *
 * @param {string} tenantId
 * @param {string} userId
 * @param {string} roleIdToAdd
 * @param {mongooseSession} session -if using with transaction
 * @returns - null if not
 */
async function insertRoleIdIntoMemberByIds(
	tenantId,
	memberId,
	roleIdToAdd,
	session = null
) {
	if (!tenantId || !memberId || !roleIdToAdd) return null;

	const opts = utils.getDefaultQueryOpts(session);

	return await TenantMemberModel.findOneAndUpdate(
		{ _id: memberId, tenantId, isDeleted: false },
		{
			$addToSet: { roles: roleIdToAdd },
		},
		opts
	);
}

/**
 *
 * @param {string} tenantId
 * @param {string} userId
 * @param {string} roleIdToRemove
 * @returns - null if not
 */
async function removeRoleIdFromMemberByIds(tenantId, memberId, roleIdToRemove) {
	if (!tenantId || !memberId || !roleIdToRemove) return null;

	console.log(memberId, tenantId, roleIdToRemove);
	return await TenantMemberModel.findOneAndUpdate(
		{ _id: memberId, tenantId, isDeleted: false },
		{ $pull: { roles: roleIdToRemove } },
		{ new: true }
	);
}

/**
 *
 * @param {object} tenantMemberData
 * @param {mongooseSession} session -if using with transaction
 * @returns
 */
async function createTenantMemberFromData(tenantMemberData, session = null) {
	const { tenantId, userId, nickName } = tenantMemberData;
	const memberModelToSave = new TenantMemberModel({
		tenantId: tenantId,
		userId: userId,
		nickName: nickName,
	});

	return await memberModelToSave.save(session ? { session } : {});
}
module.exports = {
	findTenantMemberByTenantAndMemberId,
	findTenantMemberByIds,
	insertRoleIdIntoMemberByIds,
	removeRoleIdFromMemberByIds,
	createTenantMemberFromData,
};
