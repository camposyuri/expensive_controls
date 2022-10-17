const db = require("../../database");
const { logError } = require("../../utils/errorHandler");

class ProviderRepository {
	async findAll(orderBy = "ASC") {
		try {
			const direction = orderBy.toUpperCase() === "DESC" ? "DESC" : "ASC";

			const rows = await db.query(
				`SELECT
					id,
					corporatename,
					fantasyname,
					cpfcnpj,
					typeperson,
					status,
					telephone,
					phone
				FROM
					provider ORDER BY corporatename ${direction};`
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
					SELECT
						p.*
					FROM
						provider p
					WHERE p.id = $1;
				`,
				[id]
			);

			return row;
		} catch (error) {
			logError(error);
		}
	}
}

module.exports = new ProviderRepository();
