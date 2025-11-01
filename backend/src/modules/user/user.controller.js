







async function updateUser(req, res, next) {
	try {
		const { userId } = req.params;

        
	} catch (error) {
		next(error);
	}
}

module.exports = {
	updateUser,
};
