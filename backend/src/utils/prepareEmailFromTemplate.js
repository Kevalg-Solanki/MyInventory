//templates
const verifyCredentialEmailTemplate = require("./templates/verifyCredentialOtpEmailTemplate.js");
const forgotPassOtpEmailTemplate = require("./templates/forgotPassOtpEmailTemplate.js");
const tenantDeactivationEmailTemplate = require("./templates/tenantDeactivationEmailTemplate.js");
const tenantDeletedEmailTemplate = require("./templates/tenantDeletedEmailTemplate.js");

//utils
const fillUpHtmlTemplate = require("./fillUpHtmlTemplateService.js");


/**
 * -function used for prepare email template for verify credential is just replace code in email template
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

	console.log(htmlTemplate);
	return {
		success: true,
		email,
		subject: "Tenant deactivation",
		text: "About deactivation of your tenant",
		htmlTemplate,
	};
}

async function prepareTenantDeleteEmailTemplate(email,metadata) {
	// replasables
	// [[tenantName]],[[reason]], [[actedByName]], [[actedByEmail]], [[deactivatedAt]], [[reactivationWindowHours]]
	// [[manageTenantUrl]], [[requestReactivationUrl]], [[helpCenterUrl]], [[contactSupportUrl]], [[privacyPolicyUrl]]
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

	console.log(htmlTemplate);
	return {
		success: true,
		email,
		subject: "About deletion of your tenant",
		text: "Tenant deleted",
		htmlTemplate,
	};
}

module.exports = {
	prepareVerifyCredentialEmailTemplate,
	prepareForgotPassEmailTemplate,
	prepareTenantDeactivationEmailTemplate,
	prepareTenantDeleteEmailTemplate
};
