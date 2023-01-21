const UserRepository = require("../repositories/UserRepository");
const { encryptPassword } = require("../../utils/encrypt");

class UserController {
	async index(request, response, next) {
		try {
			const { orderBy } = request.query;

			const users = await UserRepository.findAll(orderBy);

			return response.json({ results: users });
		} catch (error) {
			next(error);
		}
	}

	async show(request, response, next) {
		try {
			const { id } = request.params;

			const user = await UserRepository.findById(id);
			response.json(user);
		} catch (error) {
			next(error);
		}
	}

	async store(request, response, next) {
		try {
			let { name, email, password, status, admin } = request.body;

			const usersExists = await UserRepository.findByEmail(email);

			if (usersExists)
				return response
					.status(400)
					.json({ error: "This e-mail is already in use." });

			if (!email || !password)
				return response.status(400).json({ error: "Required information" });

			password = await encryptPassword(password);

			const user = await UserRepository.create({
				name,
				email,
				password,
				status,
				admin,
			});
			return response.json(user);
		} catch (error) {
			next(error);
		}
	}

	async update(request, response, next) {
		try {
			const { id } = request.params;
			let { email, password, status, admin } = request.body;
			password = await encryptPassword(password);

			const usersExists = await UserRepository.findById(id);

			if (!usersExists)
				return response.status(404).json({ error: "Users not found" });

			const usersByEmail = await UserRepository.findByEmail(email);

			if (usersByEmail && String(usersByEmail.id) !== String(id))
				return response
					.status(400)
					.json({ error: "This e-mail is already in use." });

			const user = await UserRepository.update(id, {
				email,
				password,
				status,
				admin,
			});
			return response.json(user);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new UserController();
