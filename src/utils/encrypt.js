const bcrypt = require("bcrypt");

const encryptPassword = async (password) => {
	//const salt = bcrypt.genSaltSync(10);
	return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashPassword) => {
	try {
		const matchPassword = await bcrypt.compare(password, hashPassword);

		return matchPassword;
	} catch (error) {
		console.log(error);
	}
};

module.exports = {
	encryptPassword,
	comparePassword,
};
