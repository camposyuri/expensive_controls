const bcrypt = require("bcrypt");

const encryptPassword = (password) => {
	const salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(password, salt);
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
