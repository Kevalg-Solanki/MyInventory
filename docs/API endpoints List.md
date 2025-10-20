##API endpoints List

1. Auth
    1. POST /auth/verify-credentials         //verify email/mobile and send otp
    2. POST /auth/verify-otp/register        //verify the otp for email and send register token in response
    3. POST /auth/resend-otp                 //resend otp on the email/mobile
    4. POST /auth/register                   //create user in database
    5. POST /auth/login                      //login user
    6. POST /auth/refresh-token              //create new token when current token is expired with refresh-token
    7. POST /auth/forgot-password/request    //verify email/mobile send otp on email/mobile
    8. POST /auth/verify-otp/forgot-password //verify otp and send forgot password token
    9. POST /auth/forgot-password            //set new password for user
    10. PATCH /auth/reset-password           //set new password with old password
    11. GET auth/me                          //get user information

2. Tenant
    1. POST /tenants/                        //create tenant for user
    2. GET /tenants/{tenantId}               //get tenant information
    3. GET /tenants/                         //get all tenants
    4. GET /tenants/mine                     //get all tenant user joined/owned
    5. POST /tenants/login                   //login into tenant
    6. PATCH /tenants/                       //update tenant information
    7. PATCH /tenants/deactivate/{tenantId}  //deactivate tenant
    8. DELETE /tenants/{tenantId}            //delete tenant

3. User
	1. PATCH user/                          //update user
	2. PATCH user/deactivate/{userId}       //deactivate user account
	3. PATCH user/{userId}/settings         //update user settings

4. Tenant Roles
    1. GET tenant-roles/{tenantId}                           //get all custom roles of tenant
    2. GET tenant-roles/with-permissions                     //get all custom roles of tenant with permissions
    3. GET tenant-roles/{tenantId}/{roleId}                  //get role's details
    4. GET tenant-roles/{tenantId}/{userId}                  //get roles of user in tenant without permissions
    5. GET tenant-roles/with-permissions/{tenantId}/{userId} //get roles of user with permissions
    6. GET tenant-roles/permissions/{tenantId}/{userId}      //get permissions for user in tenant according to roles
    7. POST tenant-roles/                                    //create custom role in the tenant
    8. PATCH tenant-roles/                                   //update role
    9. PATCH tenant-roles/assign{roleId}/{tenantId}/{userId}   //assign role to user in tenant
    10. PATCH tenant-roles/remove/{roleId}/{tenantId}/{userId} //remove roles from user
    11. DELETE tenant-roles/{roleId}                          //delete role

5. Tenant Members
	1. GET tenant-members/{tenantId}                //get all tenant members 
	2. GET tenant-members/{tenantId}/{userId}       //get tenant member details
	3. POST tenant-members/                         //create tenant member for user in the tenant
	4. POST tenant-members/invite-tenant            //sent invite to tenant
	5. POST tenant-members/invite-platform          //sent invite to platform
	6. PATCH tenant-members/{tenantId}/{userId}     //update tenant member details for tenant
	7. DELETE tenant-members/{tenantId}/{userId}    //remove tenant member from tenant

6. Product
	1. GET products/{tenantId}            //get all products of tenant
	2. POST products/                     //create product for tenant
	3. PATCH products/{productId}         //update product
	4. DELETE products/{productId}        //delete product

7. Category
	1. GET category/{tenantId}           //get all category of tenant
	2. POST category/                    //create category of tenant
	3. PATCH category/{categoryId}       //update category
	4. DELETE category/{categoryId}      //delete category

8. Sales
	1. GET sales/{tenantId}              //get all sales
	2. POST sales/                       //create sale
	3. PATCH sales/{saleId}              //update sale
	4. DELETE sales/{saleId}             //delete sale

9. Customers
	1. GET customers/{tenantId}          //get all customers
	2. POST customers/                   //create customers
	3. PATCH customer/{tenantId}         //update customers
	4. DELETE customer/{tenantId}        //delete customer

10. Supply Audits
	1. GET supply-audits/{tenantId}      //get all supply Aduits
	2. POST supply-audits/               //import supply this will import stock of products
	3. PATCH supply-audits/{supplyId}    //update supply
	4. DELETE supply-audits/{supplyId}   //delete supply

11. Notifications
	1. GET notifications/                    //get all notification related to user
	2. PATCH notifications/{notificationsId} //mark notification as read

12. Activity Logs
	1. GET activity-logs/{tenantId}          //get activity logs for the user 
	2. GET activity-logs/                    //get all activity logs for super admin

13. Requests
	1. GET requests/{userId}                 //get all request for user
	2. POST requests/{userId}                //send request to user
	3. PATCH requests/accept/{requestId}     //accept request
	4. PATCH requests/reject/{requestId}     //reject request
13. Super Admin 
	1. GET super-admin/tenants                          //get all tenants list
	2. GET super-admin/tenants/{tenantId}               //get particular tenant details
	3. PATCH super-admin/tenants/deactivate/{tenantId}  //deactivate tenant
	4. DELETE super-admin/tenants/{tenantId}            //delete tenant

		
	5. GET super-admin/users                           //get list of all users in the system
	6. GET super-admin/users/{userId}                  //get details of particular user
	7. PATCH super-admin/users/deactivate/{userId}     //deactivate user
	8. DELETE super-admin/users/{userId}               //delete user

	9. GET super-admin/products                        //get list of products from all tenants
	10. GET super-admin/products/{productId}           //get details of the product
	
	11. GET super-admin/tenant-members                 //get list of all tenant members
	12. GET super-admin/tenant-members/{memberId}      //get details for the member
	
	13. GET super-admin/tenant-roles                   //get list of all tenant roles
	14. GET super-admin/tenant-roles/{roleId}          //get details of tenant roles
	
	15. GET super-admin/activity-logs                  //get activity logs
	16. GET super-admin/activity-logs/{logId}          //get details of log

	17. POST super-admin/push-notifications-all/       //send notifications to the all tenants
	18. POST super-admin/push-notifications/{tenantId} //send notfications to the tenant
   