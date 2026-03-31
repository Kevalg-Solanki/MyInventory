//models
const {
	TenantMemberModel,
} = require("../modules/tenantMember/tenantMember.model");

//utils
const utils = require("../utils");

async function fetchAllTenantMemberWithRolesByTenantId(tenantId, pagination) {
	const convertedId = await utils.convertStrToObjectId(tenantId);
	console.log(pagination)
	try {
		const pipeline = [
			//1. find document which match values.
			{ $match: { tenantId: convertedId, isDeleted: false } },
			//2. take only fields that needed.
			{
				$project: {
					nickName: 1,
					roles: 1,
					isActive: 1,
				},
			},
			{
				$lookup: {
					from: "tenant-roles", //from which collection
					localField: "roles", //using projected variable
					foreignField: "_id", //with which field
					as: "roleDocs", //name of array
				},
			},
			{
				//take needed fields only
				$project: {
					_id:0,
					memberId: "$_id",
					nickName: 1,
					isActive: 1,
					roles: {
						$cond: [
							//condition operator
							{ $gt: [{ $size: "$roleDocs" }, 0] }, // size of docs array greaterthan 0
							//if
							{
								$map: {
									//iterate through array and create map
									input: "$roleDocs", //do process on this
									as: "role", //output name
									in: {
										roleName: "$$role.roleName", //roleName field from output doc
										roleColor: "$$role.roleColor", //roleColor field from output doc
									},
								},
							},
							//else
							[],
						],
					},
				},
			},
			//pipeline for pagination limit and document counts
			{
				$facet: {
					data: [
						{ $sort: pagination.sort },
						{ $skip: pagination.skip },
						{ $limit: pagination.limit },
					],
					totalNumberOfDocs: [{ $count: "total" }],
				},
			},
		];

		//
		const allMembers = await TenantMemberModel.aggregate(pipeline);

		return {data:allMembers[0].data,totalNumberOfDocs:allMembers[0].totalNumberOfDocs[0].total}	
		

	} catch (error) {
		throw error;
	}
}

/**
 * @param {stirng} tenantId
 * @param {string} tenantMemberId
 * @returns {object} - null if not found
 */
async function fetchTenantMemberByTenantAndMemberId(tenantId, tenantMemberId) {
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
async function fetchTenantMemberByIds(tenantId, userId) {
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
	fetchAllTenantMemberWithRolesByTenantId,
	fetchTenantMemberByTenantAndMemberId,
	fetchTenantMemberByIds,
	insertRoleIdIntoMemberByIds,
	removeRoleIdFromMemberByIds,
	createTenantMemberFromData,
};
