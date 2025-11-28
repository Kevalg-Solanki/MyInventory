//external module
const { DateTime } = require("luxon");

//constants
const { OTP_TYPE,MESSAGE_TYPE} = require("../constants/messageType.js");

/**
 * revise: add [] to key only if your using value from obj type
 * [<object.value>]:{
 *  getMessage:(metadata={})=>{
 *      return <custome message with value in metadata>
 *  }
 * }
 */
const smsContainer = {
	//OTP
	[OTP_TYPE.VERIFY_CREDENTIAL]:{
        getMessage: (metadata={})=>{
            return `Your verification otp is ${metadata?.otp} for MyInventory.It will expire in ${metadata?.expiryTime} minutes.`
        }
    },
	[OTP_TYPE.FORGOT_PASSWORD]: {
        getMessage: (metadata={})=>{
            return `Your reset password verification OTP for MyInventory is ${metadata?.otp}. It will expire in ${metadata?.expiryTime} minutes. If you did not request this, please ignore.`
        },
    },

	//TENANT
	[MESSAGE_TYPE.TENANT_DEACTIVATED_MSG]:{
        getMessage: (metadata={})=>{
            return `Your ${metadata?.tenantName} tenant is deactivated in MyInventory. Please contact us on support phone number or email if this action was not intended.`
        },
    },
	[MESSAGE_TYPE.TENANT_DELETED_MSG]: {
        getMessage: (metadata={})=>{
            return `Your ${metadata?.tenantName} tenant is deleted from MyInventory. Please contact us on support phone number or email if this action was not intended.`
        },
    },
	[MESSAGE_TYPE.PLATFORM_INVITE]: {
        getMessage: (metadata={})=>{
            return `Hey! your invited by ${metadata?.invitorName} in MyInventory. It is smart inventory managment system. Register in platform by clicking link:[[url]]`
        },
    },
	[MESSAGE_TYPE.TENANT_INVITE]: {
        getMessage: (metadata={})=>{
            return `Hey! your invited by ${metadata?.invitorName} in ${metadata?.tenantName} (${metadata?.tenantCategory}) at address ${metadata?.tenantAddress}.
				Owned by ${metadata?.tenantOwnerName}. You can accept or reject this invitation by login in MyInventory.`
        },
    },

	//USER-----------------
	[MESSAGE_TYPE.USER_DEACTIVATED_MSG]:{
        getMessage: (metadata)=>{
            return `Your ${metadata?.userName} account is deleted from MyInventory. Please contact us via our support email if this action was not intended.`
        },
    },
};

/**
 * 
 * @param {string} smsType - type of message to send
 * @param {object} metadata - object contains real data
 * @returns {string|null} - return message
 */
async function prepareSms(smsType,metadata={}){

    //check sms exist for this sms type
    const messageContainer = smsContainer[smsType];

    if(!messageContainer) return null;

    return messageContainer.getMessage(metadata);
    
}


module.exports = prepareSms;