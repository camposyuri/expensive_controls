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
}

module.exports = new CustomerRepository();
