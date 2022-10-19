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

	async store(request, response, next) {
		try {
			const body = request.body;

			const customer = await CustomerRepository.create(body);

			if (customer <= 0)
				return response.status(400).send("Problems creating customer");

			return response.json(customer);
		} catch (error) {
			next(error);
		}
	}
}

module.exports = new CustomerController();
