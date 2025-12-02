//utils

const paginationHandler = require("../../utils/paginationHandler");

// GET /me
async function getAllActiveRequestOfUser(req, res, next) {
	try {
		const pagination = paginationHandler(
			req.query?.page,
			req.query?.limit,
			req.query?.sort
		);

        

	} catch (error) {
		next(error);
	}
}

module.exports = {
	getAllActiveRequestOfUser,
};
