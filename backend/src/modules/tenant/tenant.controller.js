//utiles
const sendResponse = require("../../utils/sendResponse");

//service
const {
	createAndSetupTenantForUser,
	getTenantDataById,
	getTenantsConnectedToUserById,
} = require("./tenant.service");

//tenant/
async function createTenant(req, res, next) {
	try {

		const tenantId = await createAndSetupTenantForUser(req.user, req.body);

		return sendResponse(res, 200, "New tenant opened successfully", {
			tenantId: tenantId,
		});
	} catch (error) {
		next(error);
	}
}

//tenant/:tenantId
async function getTenantData(req, res, next) {
	try {
		console.log("get tenant data")
		//destruct
		const { tenantId } = req.params;

		
		const tenantData = await getTenantDataById(tenantId);

		return sendResponse(res, 200, "Tenant fetched successfully", {
			tenantData
		});
	} catch (error) {
		next(error);
	}
}

//tenant/mine
async function getTenantsConnectedToUser(req, res, next) {
	console.log("controller")
	try {	
		console.log("controller")
		const allTenants = await getTenantsConnectedToUserById(req.user);

		return sendResponse(res, 200, "All tenants fetched successfully", {allTenants});

	} catch (error) {
		console.log("in catch")
		next(error);
	}
}

//tenant/login
async function loginInTenant(req, res, next){
	try
	{
		const {tenantId} = req.body;
		const userId = req.user._id;

		
	}
	catch(error)
	{
		next(error);
	}
}


module.exports = {
	createTenant,
	getTenantData,
	getTenantsConnectedToUser,
	loginInTenant
};
