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
}

module.exports = new AccountController();
