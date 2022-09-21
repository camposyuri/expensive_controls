const jwt = require("jwt-simple");
const { comparePassword } = require("../../utils/encrypt");

const SingInRepository = require("../repositories/SingInRepository");

require("dotenv").config();

class SignInController {
	async store(request, response, next) {
		try {
			const { email, password } = request.body;

			if (!email && !password)
				return response.status(400).send("Enter username and password!");

			const usersExists = await SingInRepository.findByEmail(email);

			if (!usersExists)
				return response.status(400).json({ error: "User not found." });

			const isDeriredPassword = await comparePassword(
				password,
				usersExists.password
			);

			if (!isDeriredPassword)
				return response.status(401).send("Invalid email or password");

			const now = Math.floor(Date.now() / 1000);

			const payload = {
				id: usersExists.id,
				email: usersExists.email,
				status: usersExists.status,
				admin: usersExists.admin,
				iat: now, // issued at -> emitido em
				exp: now + 60 * 60 * 24, // Mais 60S * 60M * 24H Vale 1 dia
			};

			response.json({
				...payload,
				token: jwt.encode(payload, process.env.AUTH_SECRET),
			});
		} catch (error) {
			next(error);
		}
	}

	async validateToken(request, response, next) {
		try {
			const { token } = request.body || null;
			if (token) {
				const userToken = jwt.decode(token, process.env.AUTH_SECRET);

				if (new Date(userToken.exp * 1000) > new Date())
					return response.send(true);

				return response.send(false);
			}
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new SignInController();
