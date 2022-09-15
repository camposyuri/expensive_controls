const jwt = require("jwt-simple");
// const bcrypt = require("bcrypt");

require("dotenv").config();

const { comparePassword } = require("../../utils/encrypt");

const SingInRepository = require("../repositories/SingInRepository");

class SignInController {
	async store(request, response) {
		const { email, password } = request.body;

		if (!email && !password)
			return response.status(400).send("Enter username and password!");

		const usersExists = await SingInRepository.findByEmail(email);
		// console.log({ usersExists });
		if (!usersExists)
			return response.status(400).json({ error: "User not found." });

		const isDeriredPassword = await comparePassword(
			password,
			usersExists.password
		);

		console.log({ a: isDeriredPassword });

		if (!isDeriredPassword)
			return response.status(401).send("Invalid email or password");

		const now = Math.floor(Date.now() / 1000);

		const payload = {
			id: usersExists.id,
			email: usersExists.email,
			status: usersExists.status,
			admin: usersExists.admin,
			iat: now, // issued at -> emitido em
			exp: now + 60 * 60 * 24, // Token vale um dia
		};

		response.json({
			...payload,
			token: jwt.encode(payload, process.env.AUTH_SECRET),
		});
	}
}

module.exports = new SignInController();
