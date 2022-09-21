const bcrypt = require("bcrypt");
const { logError } = require("./errorHandler");

const encryptPassword = async (password) => {
	return await bcrypt.hash(password, 10);
};

const comparePassword = async (password, hashPassword) => {
	try {
		const matchPassword = await bcrypt.compare(password, hashPassword);

		return matchPassword;
	} catch (error) {
		logError(error);
	}
};

module.exports = {
	encryptPassword,
	comparePassword,
};
