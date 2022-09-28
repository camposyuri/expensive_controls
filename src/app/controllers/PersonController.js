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

	async show(request, response, next) {
		try {
			const { id } = request.params;

			const person = await PersonRepository.findById(id);
			return response.json(person);
		} catch (error) {
			next(error);
		}
	}

	async store() {}

	async update() {}
}

module.exports = new PersonController();
