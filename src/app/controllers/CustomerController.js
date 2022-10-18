const AddressRepository = require("../repositories/AddressRepository");
const CustomerRepository = require("../repositories/CustomerRepository");

class CustomerController {
	async index(request, response, next) {
		try {
			const { orderBy } = request.query;

			const customer = await CustomerRepository.findAll(orderBy);
			return response.json({ results: customer });
		} catch (error) {
			next(error);
		}
	}

	async show(request, response, next) {
		try {
			const { id } = request.params;

			const customer = await CustomerRepository.findById(id);
			const address = await AddressRepository.findAddress("id_customer", id);

			return response.json({ ...customer, endereco: address });
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new CustomerController();
