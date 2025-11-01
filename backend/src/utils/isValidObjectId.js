const { ObjectId } = require("mongodb");


module.exports = function isValidObjectId(idToValidate){
	return (
		ObjectId.isValid(idToValidate) && String(new ObjectId(idToValidate)) === idToValidate
	);
};