/**
 *
 * @param {number} length - define number of digit otp to generate
 * @return {number} - return generated otp
 */
const generateOtp = async (length = 6) => {
	return Math.floor(10000 + Math.random() * 900000);
};

module.exports = {
	generateOtp,
};
