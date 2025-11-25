//models
const { TenantModel } = require("../modules/tenant/tenant.model");
const { convertStrToObjectId } = require("../utils");

/**
 * @param {string} tenantId - id of tenant to get data
 * @returns {object | null}
 */
async function fetchTenantDataById(tenantId) {
	const convertedId = await convertStrToObjectId(tenantId);

	return await TenantModel.findOne({ _id: convertedId, isDeleted: false });
}

/**
 * @param {string} tenantId - id of tenant to get data
 * @returns {object | null}
 */
async function fetchTenantStatusById(tenantId) {
	const convertedId = await convertStrToObjectId(tenantId);

	return await TenantModel.findOne({
		_id: convertedId,
		isDeleted: false,
	}).select("isDelete isActive");
}

/**
 * - used for getting required data only
 * @param {string} tenantId - tenantId to find tenant with
 * @param {string} selectedDataQuery - selected fields to get e.g "tenantName tenantCategory ownerId"
 * @returns {object | null} - return selected fields only
 */
async function fetchSelectedTenantFieldsById(tenantId, selectedDataQuery="") {
	const convertedId = await convertStrToObjectId(tenantId);

	return await TenantModel.findOne({
		_id: convertedId,
		isDeleted: false,
	}).select(selectedDataQuery);
}

module.exports = {
	fetchTenantDataById,
	fetchTenantStatusById,
    fetchSelectedTenantFieldsById
};
