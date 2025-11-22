//utiles
const sendResponse = require("../../utils/sendResponse");

//service
const {
	createAndSetupTenantForUser,
	getTenantDataById,
	getTenantsConnectedToUserById,
	loginUserIntoTenant,
	updateTenantData,
	deactivateTenantAndNotifyOwner,
	deleteTenantAndNotifyOwner,
} = require("./tenant.service");

//tenants/ POST
async function createTenant(req, res, next) {
	try {
		const tenantId = await createAndSetupTenantForUser(req.user, req.body);

		return sendResponse(res, 201, "New tenant opened successfully", {
			tenantId: tenantId,
		});
	} catch (error) {
		next(error);
	}
}

//tenants/:tenantId GET
async function getTenantData(req, res, next) {
	try {
		const { tenantId } = req.params;

		const tenantData = await getTenantDataById(tenantId);
		
		return sendResponse(res, 200, "Tenant fetched successfully", {
			tenantData,
		});
	} catch (error) {
		next(error);
	}
}

//tenants/mine
async function getTenantsConnectedToUser(req, res, next) {
	try {
		const allTenants = await getTenantsConnectedToUserById(req.user);

		return sendResponse(res, 200, "All tenants fetched successfully", {
			allTenants,
		});
	} catch (error) {
		next(error);
	}
}

//tenants/login
async function loginInTenant(req, res, next) {
	try {
		const { tenantId } = req.body;
		const userId = req.user._id;

		const loginRequiredData = await loginUserIntoTenant(userId, tenantId);

		return sendResponse(res, 200, "Welcome to tenant!", { loginRequiredData });
	} catch (error) {
		next(error);
	}
}

//tenants/:tenandId PATCH
async function updateTenant(req, res, next) {
	try {
		const newTenantData = req.body;
		const { tenantId } = req.params;

		const updatedTenantData = await updateTenantData(tenantId, newTenantData);

		return sendResponse(res, 200, "Updated successfully", {
			updatedTenantData,
		});
	} catch (error) {
		next(error);
	}
}

//tenants/deactivate/:tenantId PATCH
async function deactivateTenant(req, res, next) {
	try {
		const { tenantId } = req.params;

		await deactivateTenantAndNotifyOwner(tenantId, req.user);

		return sendResponse(res, 200, "Deactivated tenant successfully.");
	} catch (error) {
		next(error);
	}
}

//tenants/:tenantId DELETE
async function deleteTenant(req, res, next) {
	try {
		const { tenantId } = req.params;

		await deleteTenantAndNotifyOwner(tenantId, req.user);

		return sendResponse(res, 200, "Deleted tenant successfully.");
	} catch (error) {
		next(error);
	}
}

module.exports = {
	createTenant,
	getTenantData,
	getTenantsConnectedToUser,
	loginInTenant,
	updateTenant,
	deactivateTenant,
	deleteTenant,
};
