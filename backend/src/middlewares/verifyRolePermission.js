//Module services
const {
	findTenantMemberByIds,
} = require("../modules/tenantMember/tenantMember.service.js");
const {
	getCombinedPermsOfRolesByRoleIds,
} = require("../modules/tenantRole/tenantRole.service.js");
const { isValidObjectId} = require("../utils");

//constants

const {TENANT_ERROR, AUTH_ERROR} = require("../constants");
const PERMS = require("../constants/permission.js");
const { RESTRICTED_PERMS } = require("../constants/permSets.js");

//utils
const throwAppError = require("../utils/throwAppError.js");

/**
 * ----- ROLE PERMISSION VERIFICATION FLOW SUMMERY -----
 * 
 * 1. Check tenantId found in header
 * 2. Check tenantId is valid Object Id
 * 3. Verify user is member of tenant by userId,tenantId
 * 4. Get array of all permission from all roles that member(user of tenant) have
 * 5. Check if there is 0 permission 
 * 6. Create set of permission for faster iteration (new Set(permissions))
 * 7. Skip if member have 'TENANT_OWNER_PERMS' (only user who created tenant have it).
 * 8. Check if required permission for action is restricted permission which only allowed for OWNER
 * 9. Skip if member have 'TENANT_CO_OWNER_PERMS' (cannot bypass restricted permissions)
 * 10.Finally 
 * 11.Check member permission set have required permission
 * 
 * Throw error on every step if not valid
 */

const verifyRolePermission = (requiredPerms = []) => {
	return async (req, res, next) => {
		//single function for throwing error insted of repeating longer syntax
		const throwError = (error) => next(throwAppError(error));

		try {
			const tenantId = req.header("x-tenant-id");

			//Tenant exist
			if (!tenantId) return throwError(TENANT_ERROR.TENANT_NOT_FOUND);

			//Tenant id validation
			if (!isValidObjectId(tenantId)) return throwError(AUTH_ERROR.REQUEST_INVALID);

			//Verify user is member of tenant or not
			const tenantMember = await findTenantMemberByIds(req.user._id, tenantId);

			if (!tenantMember) return throwError(AUTH_ERROR.UNAUTHORIZED_ACCESS);

			//Get combined role permissions
			const memberPerms = await getCombinedPermsOfRolesByRoleIds(
				tenantMember.roles
			);

			//Validate member have perms or not
			if (!Array.isArray(memberPerms) || memberPerms.length == 0)
				throwError(AUTH_ERROR.ACCESS_DENIED);

			//Using Sets for faster interation checks
			const memberPermsSet = new Set(memberPerms);

			//--Direct skip if 'TENANT_OWNER_PERM' found
			if (memberPermsSet.has(PERMS.TENANT_OWNER_PERMS)) return next();

			//--Check for 'restricted perms' for Other roles
			for (const perm of RESTRICTED_PERMS) {
				if (requiredPerms.includes(perm))
					return throwError(AUTH_ERROR.ACCESS_DENIED);
			}

			//--Skip unrestricted perms if 'TENANT_CO_OWNER_PERMS' found
			if (memberPermsSet.has(PERMS.TENANT_CO_OWNER_PERMS)) return next();

			//Verify member have required perms
			for (const perm of requiredPerms) {
				if (!memberPermsSet.has(perm)) return throwError(AUTH_ERROR.ACCESS_DENIED);
			}

			//Let member pass if all required perms foundb
			return next();
		} catch (error) {
			return next(error);
		}
	};
};


module.exports = verifyRolePermission;
