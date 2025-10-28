//utiles
const sendResponse = require("../../utils/sendResponse");

//service
const { checkTenantNameTaken,
	 saveNewTenantInDatabaseByUserId,
	 addTenantIdInUser
	} = require("./tenant.service");



//tenant/
const createTenant = async (req, res, next) => {
	try {
		//destruct
		const { tenantName } = req.body;

		//check any tenant with same name exist
		await checkTenantNameTaken(tenantName);

		//if tenant name is not taken then
        
        //create tenant
        const savedTenant = await saveNewTenantInDatabaseByUserId(req.user._id,req.body);
        
		//save tenant id in user document
		await addTenantIdInUser(req.user,savedTenant?._id);

		//create default tenant role "Owner" and assign to user 
		await setupDefaultTenantRoleAndAssignToUser(req.user._id,savedTenant?._id);

		return sendResponse(res,200,"New tenant opened successfully");

	} catch (error) {
		next(error);
	}
};


module.exports = {
    createTenant
}