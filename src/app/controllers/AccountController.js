const AccountRepository = require("../repositories/AccountRepository");

class AccountController {
	async index(request, response, next) {
		try {
			const { orderBy } = request.query;

			const account = await AccountRepository.findAll(orderBy);
			return response.json({ results: account });
		} catch (error) {
			next(error);
		}
	}

	async show(request, response, next) {
		try {
			const { id } = request.params;

			const account = await AccountRepository.findById(id);
			return response.json(account);
		} catch (error) {
			next(error);
		}
	}

	async store(request, response, next) {
		try {
			const body = request.body;

			const account = await AccountRepository.create(body);

			if (account <= 0)
				return response.status(400).send("Problems creating account");

			return response.json(account);
		} catch (error) {
			next(error);
		}
	}

	async update(request, response, next) {
		try {
			const { id } = request.params;
			const body = request.body;

			const account = await AccountRepository.update(id, body);

			if (account <= 0)
				return response.status(400).send("Problem updating account");

			return response.json(account);
		} catch (error) {
			next(error);
		}
	}

	async findAccountAllType(_, response, next) {
		try {
			const account = await AccountRepository.findAccountType();
			return response.json({ results: account });
		} catch (error) {
			next(error);
		}
	}

	async findAccountAllClassification(_, response, next) {
		try {
			const account = await AccountRepository.findAccountClassification();
			return response.json({ results: account });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new AccountController();
