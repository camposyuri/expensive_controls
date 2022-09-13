const bcrypt = require("bcrypt");

const encryptPassword = (password) => {
	const salt = bcrypt.genSaltSync(10);
	return bcrypt.hashSync(password, salt);
};

const comparePassword = (password, hashPassword) => {
	const isMatchPassword = bcrypt.compareSync(password, hashPassword);
	return isMatchPassword;
};

module.exports = {
	encryptPassword,
	comparePassword,
};
