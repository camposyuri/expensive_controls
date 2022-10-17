const AddressRepository = require("../repositories/AddressRepository");
const ProviderRepository = require("../repositories/ProviderRepository");

class ProviderController {
	async index(request, response, next) {
		try {
			const { orderBy } = request.params;

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
}

module.exports = new ProviderController();
