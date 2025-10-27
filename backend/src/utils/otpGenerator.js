/**
 *
 * @param {number} length - define number of digit otp to generate
 * @return {number} - return generated otp
 */
const generateOtp = async (length = 6) => {
	let Otp = Math.floor(10000 + Math.random() * 900000);
	console.log(Otp.length)
	if(Otp <= 99999)
		Otp = Math.floor(10000 + Math.random() * 900000);

	return Otp;
};

module.exports = {
	generateOtp,
};
