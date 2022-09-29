const AddressRepository = require("../repositories/AddressRepository");
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

			const address = await AddressRepository.findAddress("id_person", id);

			return response.json({ ...person, endereco: address });
		} catch (error) {
			next(error);
		}
	}

	async store(request, response, next) {
		try {
			const personRequest = request.body;

			const person = await PersonRepository.create(personRequest);

			if (person <= 0)
				return response.status(400).send("Problems creating person");

			return response.json(person);
		} catch (error) {
			next(error);
		}
	}

	async update() {}
}

module.exports = new PersonController();
