const AddressRepository = require("../repositories/AddressRepository");
const ProviderRepository = require("../repositories/ProviderRepository");

class ProviderController {
	async index(request, response, next) {
		try {
			const { orderBy } = request.query;

			const provider = await ProviderRepository.findAll(orderBy);
			return response.json({ results: provider });
		} catch (error) {
			next(error);
		}
	}

	async show(request, response, next) {
		try {
			const { id } = request.params;

			const provider = await ProviderRepository.findById(id);

			const address = await AddressRepository.findAddress("id_provider", id);

			return response.json({ ...provider, endereco: address });
		} catch (error) {
			next(error);
		}
	}

	async store(request, response, next) {
		try {
			const body = request.body;

			const provider = await ProviderRepository.create(body);

			if (provider <= 0)
				return response.status(400).send("Problems creating provider");

			return response.json(provider);
		} catch (error) {
			next(error);
		}
	}

	async update(request, response, next) {
		try {
			const { id } = request.params;
			const body = request.body;

			const provider = await ProviderRepository.update(id, body);

			if (provider <= 0)
				return response.status(400).send("Problems updating provider");

			return response.json(provider);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new ProviderController();
