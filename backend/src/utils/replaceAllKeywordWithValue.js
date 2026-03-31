/**
 *
 * @param {string} strToFillUp - string to replace keyword
 * @param {Object} dataToFill - Object which have key for e.g [[replacethis]] and key's value e.g john doe
 * @returns {string} - data replaced html template
 *
 */
module.exports = function replaceAllKeywordWithValue(strToFillUp, dataToFill) {
	let filledStr = strToFillUp;

	for (const [key, value] of Object.entries(dataToFill)) {
		filledStr = filledStr.replaceAll(key, value);
	}

	return filledStr;
}


