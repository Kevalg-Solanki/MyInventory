//external module
const {DateTime} = require("luxon")

//templates
const verifyCredentialEmailTemplate = require("./templates/verifyCredentialOtpEmailTemplate.js");
const forgotPassOtpEmailTemplate = require("./templates/forgotPassOtpEmailTemplate.js");
const tenantDeactivationEmailTemplate = require("./templates/tenantDeactivationEmailTemplate.js");
const tenantDeletedEmailTemplate = require("./templates/tenantDeletedEmailTemplate.js");
const userDeactivationEmailTemplate = require("./templates/userDeactivationEmailTemplate.js")
const tenantInviteEmailTemplate = require("./templates/tenantInviteEmailTemplate.js");

//utils
const fillUpHtmlTemplate = require("./fillUpHtmlTemplateService.js");
const platformInviteEmailTemplate = require("./templates/platformInviteEmailTemplate.js");

//** -function used for prepare email template for verify credential is just replace code in email template

/**
 * @param {string} email - receiver email
 * @param {Object} metadata - containains otp and expireIn time
 * @returns {Object} - response
 */

async function prepareVerifyCredentialEmailTemplate(email, metadata) {
	const { otp, expireIn } = metadata;
	//prepare html template for email to send
	let htmlTemplate = verifyCredentialEmailTemplate.replace(
		"[[verification-code]]",
		otp
	);

	htmlTemplate = htmlTemplate.replace("[[expireIn]]", expireIn);

	return {
		success: true,
		email,
		subject: "Verification Otp for MyInventory",
		text: "Your Verification Otp",
		htmlTemplate,
	};
}

/**
 * @param {string} email - receiver email
 * @param {Object} metadata - verification code
 * @returns {Object} - response
 */
async function prepareForgotPassEmailTemplate(email, metadata) {
	const { otp, expireIn } = metadata;
	//prepare html template for email to send
	let htmlTemplate = forgotPassOtpEmailTemplate.replace(
		"[[verification-code]]",
		otp
	);

	htmlTemplate = htmlTemplate.replace("[[expireIn]]", expireIn);

	return {
		success: true,
		email,
		subject: "Verification Otp for MyInventory",
		text: "Your Forgot Password Verification Otp",
		htmlTemplate,
	};
}

/**
 * @param {string} email - receiver email
 * @param {Object} metadata - data to send
 * @returns {Object} - response
 */
async function prepareTenantDeactivationEmailTemplate(email, metadata) {
	// replasables
	// [[tenantName]],[[reason]], [[actedByName]], [[actedByEmail]], [[deactivatedAt]], [[reactivationWindowHours]]
	// [[manageTenantUrl]], [[requestReactivationUrl]], [[helpCenterUrl]], [[contactSupportUrl]], [[privacyPolicyUrl]]
	const {
		tenantName,
		tenantId,
		actedByName,
		actedByEmail,
		actedByMobile,
		deactivatedAt,
		reactivationWindowHours,
	} = metadata;

	let htmlTemplate = fillUpHtmlTemplate(tenantDeactivationEmailTemplate, {
		"[[tenantName]]": tenantName,
		"[[tenantId]]":tenantId,
		"[[reason]]": "Not provided",
		"[[actedByName]]": actedByName,
		"[[actedByEmail]]": actedByEmail,
		"[[actedByMobile]]": actedByMobile,
		"[[deactivatedAt]]": deactivatedAt,
		"[[reactivationWindowHours]]": reactivationWindowHours,
	});

	return {
		success: true,
		email,
		subject: "Tenant deactivation",
		text: "About deactivation of your tenant",
		htmlTemplate,
	};
}

/**
 * @param {string} email - receiver email
 * @param {Object} metadata - data to send
 * @returns {Object} - response
 */
async function prepareTenantDeleteEmailTemplate(email,metadata) {
	// replasables
	const {
		tenantName,
		tenantId,
		actedByName,
		actedByEmail,
		actedByMobile,
		deletedAt,
		reactivationWindowHours,
	} = metadata;

	let htmlTemplate = fillUpHtmlTemplate(tenantDeletedEmailTemplate, {
		"[[tenantName]]": tenantName,
		"[[tenantId]]":tenantId,
		"[[reason]]": "Not provided",
		"[[actedByName]]": actedByName,
		"[[actedByEmail]]": actedByEmail,
		"[[actedByMobile]]": actedByMobile,
		"[[deletedAt]]": deletedAt,
		"[[graceWindowHours]]": reactivationWindowHours,
	});

	return {
		success: true,
		email,
		subject: "About deletion of your tenant",
		text: "Tenant deleted",
		htmlTemplate,
	};
}

/**
 * @param {string} email - receiver email
 * @param {Object} metadata - data to send
 * @returns {Object} - response
 */
async function prepareUserDeactivationEmailTemplate(email, metadata) {
	// replasables
	const {
		userName,
		userId,
		userEmail,
		userMobile,
		actedByName,
		actedByEmail,
		actedByMobile,
		deactivatedAt,
		reactivationWindowHours,
	} = metadata;

	let htmlTemplate = fillUpHtmlTemplate(userDeactivationEmailTemplate, {
		"[[userFullName]]": userName,
		"[[userId]]":userId,
		"[[userEmail]]":userEmail,
		"[[userMobile]]":userMobile,
		"[[reason]]": "Not provided",
		"[[actedByName]]": actedByName,
		"[[actedByEmail]]": actedByEmail,
		"[[actedByMobile]]": actedByMobile,
		"[[deactivatedAt]]": deactivatedAt,
		"[[reactivationWindowHours]]": reactivationWindowHours,
	});

	return {
		success: true,
		email,
		subject: "Account deactivation",
		text: "About deactivation of your Account",
		htmlTemplate,
	};
}

/**
 * @param {string} email - receiver email
 * @param {Object} metadata - data to send
 * @returns {Object} - response
 */
async function prepareTenantInviteEmailTemplate(email, metadata) {
	// replasables
	let htmlTemplate = fillUpHtmlTemplate(tenantInviteEmailTemplate, {
		"[[invitorName]]": metadata?.invitorName,
		"[[tenantName]]":metadata?.tenantName,
		"[[tenantCategory]]":metadata?.tenantCategory,
		"[[tenantOwnerName]]": metadata?.ownerName,
		"[[tenantAddress]]": metadata?.tenantAddress,
		"[[expirationDays]]":"30" 
	});

	return {
		success: true,
		email,
		subject: "Invitation to join",
		text: "Your invited to join tenant.",
		htmlTemplate,
	};
}


/**
 * @param {string} email - receiver email
 * @param {Object} metadata - data to send
 * @returns {Object} - response
 */
async function preparePlatformInviteEmailTemplate(email, metadata) {
	// replasables

	const todayDate = DateTime.now().setZone("Asian/Kolkata").toFormat("MM/DD/YYYY")
	let htmlTemplate = fillUpHtmlTemplate(platformInviteEmailTemplate, {
		"[[invitorName]]": metadata?.invitorName,
		"[[invitationDate]]": todayDate,
		"[[expirationDays]]":"30" 
	});

	return {
		success: true,
		email,
		subject: "Invitation to platform",
		text: "Your invited to join platform.",
		htmlTemplate,
	};
}


module.exports = {
	prepareVerifyCredentialEmailTemplate,
	prepareForgotPassEmailTemplate,
	prepareTenantDeactivationEmailTemplate,
	prepareTenantDeleteEmailTemplate,
	prepareUserDeactivationEmailTemplate,
	prepareTenantInviteEmailTemplate,
	preparePlatformInviteEmailTemplate
};
