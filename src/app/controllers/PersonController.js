const PersonRepository = require("../repositories/PersonRepository");

class PersonController {
	async index(request, response, next) {
		try {
			const { orderBy } = request.query;

			const person = await PersonRepository.findAll(orderBy);
			return response.json({ results: person });
		} catch (error) {
			next(error);
		}
	}

	async show() {}

	async store() {}

	async update() {}
}

module.exports = new PersonController();
