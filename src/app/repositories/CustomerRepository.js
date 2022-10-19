const db = require("../../database");
const { logError } = require("../../utils/errorHandler");

class CustomerRepository {
	async findAll(orderBy = "ASC") {
		try {
			const direction = orderBy.toUpperCase() === "DESC" ? "DESC" : "ASC";

			const rows = await db.query(
				`
					SELECT
						id,
						corporatename,
						fantasyname,
						cpfcnpj,
						typeperson,
						datecreated,
						status,
						telephone,
						phone
					FROM
						customer ORDER BY id ${direction}
				`
			);
			return rows;
		} catch (error) {
			logError(error);
		}
	}

	async findById(id) {
		try {
			const [row] = await db.query(
				`
					SELECT * FROM customer WHERE id = $1;
				`,
				[id]
			);

			return row;
		} catch (error) {
			logError(error);
		}
	}

	async create(customer) {
		try {
			const customerJson = JSON.stringify(customer);

			const [row] = await db.query(
				`
					SELECT public.CreateCustomer($1::json);
				`,
				[customerJson]
			);

			return row;
		} catch (error) {
			logError(error);
		}
	}

	async update(id, customer) {
		try {
			const parsedCustomerJson = JSON.stringify(customer);

			const [row] = await db.query(
				`
					SELECT public.UpdateCustomer($1::int, $2::json);
				`,
				[id, parsedCustomerJson]
			);

			return row;
		} catch (error) {
			logError(error);
		}
	}
}

module.exports = new CustomerRepository();
