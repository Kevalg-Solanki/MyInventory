

/**
 * 
 * @param {string} htmlTemplate - html template in string data type
 * @param {Object} dataToFill - Object which have key for e.g [[replacethis]] and key's value e.g john doe
 * @returns {string} - data replaced html template
 * 
 */
function fillUpHtmlTemplate(htmlTemplate,dataToFill){

    let filledTemplate = htmlTemplate;
    
    for(const [key,value] of Object.entries(dataToFill))
    {
        filledTemplate = filledTemplate.replaceAll(key,value);
    }

    return filledTemplate;

}

module.exports = fillUpHtmlTemplate;