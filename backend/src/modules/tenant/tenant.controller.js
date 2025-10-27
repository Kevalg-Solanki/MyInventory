const { checkTenantNameTaken } = require("./tenant.service");



const createTenant = async (req,res,next)=>{
    try
    {
        //destruct 
        const {
            tenantName
        }=req.body

        //check any tenant with same name exist
        await checkTenantNameTaken(tenantName);

        //if tenant name is not taken then 

    }
    catch(error)
    {
        next(error);
    }
}