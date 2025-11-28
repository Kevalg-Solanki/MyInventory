//external module
const { DateTime } = require("luxon");

//constants
const { OTP_TYPE, MESSAGE_TYPE } = require("../constants/messageType.js");

//templates
const templates = require("./templates/index.js");

//utils
const fillUpHtmlTemplate = require("./fillUpHtmlTemplateService.js");



/**
 * - D  efine values to replace and set email for each email types
 * 
 * revise: add [] to key only if your using value from obj type
 * 
 * [<email type>*string*)]:{
 * 		subject: <email subject>*string)*,
		text: <email text>*string)*,
		emailTemplate: <email template>*string)*,
		getReplcerObj: (<object contains value>) => ({
			"<keyword/defined code to replace value with>": <object.value>,
			"<keyword/defined code to replace value with>": <object.value>,
			...
		}),
 * }
 */

const todayDate = DateTime.now()
				.setZone("Asian/Kolkata")
				.toFormat("MM/DD/YYYY")
const htmlTemplateReplacerObj = {
	//OTP
	[OTP_TYPE.VERIFY_CREDENTIAL]: {
		subject: "Verification code",
		text: "Your verification code for registration",
		emailTemplate: templates.verifyCredentialOtp,
		getReplcerObj: (metadata) => ({
			"[[verification-code]]": metadata?.otp,
			"[[expireIn]]": metadata?.expireIn,
		}),
	},
	[OTP_TYPE.FORGOT_PASSWORD]: {
		subject: "Reset password code",
		text: "Your code to set new password",
		emailTemplate: templates.forgotPassOtp,
		getReplcerObj: (metadata) => ({
			"[[verification-code]]": metadata?.otp,
			"[[expireIn]]": metadata?.expireIn,
		}),
	},

	//TENANT
	[MESSAGE_TYPE.TENANT_DEACTIVATED_MSG]: {
		subject: "Tenant Deactivated!",
		text: "About deactivation of your tenant.",
		emailTemplate: templates.tenantDeactivation,
		getReplcerObj: (metadata) => ({
			"[[tenantName]]": metadata?.tenantName,
			"[[tenantId]]": metadata?.tenantId,
			"[[reason]]": "Not provided",
			"[[actedByName]]": metadata?.actedByName,
			"[[actedByEmail]]": metadata?.actedByEmail,
			"[[actedByMobile]]": metadata?.actedByMobile,
			"[[deactivatedAt]]": metadata?.deactivatedAt,
			"[[reactivationWindowHours]]": metadata?.reactivationWindowHours,
		}),
	},
	[MESSAGE_TYPE.TENANT_DELETED_MSG]: {
		subject: "Tenant Deleted!",
		text: "About deletation of your tenant.",
		emailTemplate: templates.tenantDelete,
		getReplcerObj: (metadata) => ({
			"[[tenantName]]": metadata?.tenantName,
			"[[tenantId]]": metadata?.tenantId,
			"[[reason]]": "Not provided",
			"[[actedByName]]": metadata?.actedByName,
			"[[actedByEmail]]": metadata?.actedByEmail,
			"[[actedByMobile]]": metadata?.actedByMobile,
			"[[deletedAt]]": metadata?.deletedAt,
			"[[graceWindowHours]]": metadata?.reactivationWindowHours,
		}),
	},
	[MESSAGE_TYPE.PLATFORM_INVITE]: {
		subject: "Platform Invitation ",
		text: "Invitation to join smart inventory management and tenant.",
		emailTemplate: templates.platformInvite,
		getReplcerObj: (metadata) => ({
			"[[invitorName]]": metadata?.invitorName,
			"[[invitationDate]]": `${todayDate}`,
			"[[expirationDays]]": "30",
		}),
	},
	[MESSAGE_TYPE.TENANT_INVITE]: {
		subject: "Tenant Invitation",
		text: "You are invited by tenant to join them",
		emailTemplate: templates.tenantInvite,
		getReplcerObj: (metadata) => ({
			"[[invitorName]]": metadata?.invitorName,
			"[[tenantName]]": metadata?.tenantName,
			"[[tenantCategory]]": metadata?.tenantCategory,
			"[[tenantOwnerName]]": metadata?.ownerName,
			"[[tenantAddress]]": metadata?.tenantAddress,
			"[[expirationDays]]": "30",
		}),
	},
	//USER
	[MESSAGE_TYPE.USER_DEACTIVATED_MSG]: {
		subject: "Account Deactivated",
		text: "About Deactivation of your account",
		emailTemplate: templates.userDeactivation,
		getReplcerObj: (metadata) => ({
			"[[userFullName]]": metadata?.userName,
			"[[userId]]": metadata?.userId,
			"[[userEmail]]": metadata?.userEmail,
			"[[userMobile]]": metadata?.userMobile,
			"[[reason]]": "Not provided",
			"[[actedByName]]": metadata?.actedByName,
			"[[actedByEmail]]": metadata?.actedByEmail,
			"[[actedByMobile]]": metadata?.actedByMobile,
			"[[deactivatedAt]]": metadata?.deactivatedAt,
			"[[reactivationWindowHours]]": metadata?.reactivationWindowHours,
		}),
	},
};

//** -function used for prepare email template. It just replace defined codes in email template with real values
/**
 * @param {string} emailType - typle of email it define which email template to use
 * @param {string} email - receiver email
 * @param {Object} metadata - data to send
 * @returns {Object} - response
 */
async function prepareEmailTemplate(emailType, email, metadata) {
	//check type available
	const replacerObj = htmlTemplateReplacerObj[emailType];

	//check if template for email type exist
	if (!replacerObj) {
		return null;
	}

	let htmlTemplate = fillUpHtmlTemplate(
		replacerObj?.emailTemplate,
		replacerObj?.getReplcerObj(metadata)
	);

	return {
		success: true,
		email,
		subject: replacerObj?.subject,
		text: replacerObj?.text,
		htmlTemplate,
	};
}

module.exports = prepareEmailTemplate;
