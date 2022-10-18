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
					provider ORDER BY id ${direction};`
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

	async create(provider) {
		try {
			const providerJson = JSON.stringify(provider);

			const [row] = await db.query(
				`
					SELECT public.CreateProvider($1::json);
				`,
				[providerJson]
			);
			return row;
		} catch (error) {
			logError(error);
		}
	}

	async update(id, provider) {
		try {
			const providerJson = JSON.stringify(provider);

			const [row] = await db.query(
				`
					SELECT public.UpdateProvider($1::int, $2::json);
				`,
				[id, providerJson]
			);

			return row;
		} catch (error) {
			logError(error);
		}
	}
}

module.exports = new ProviderRepository();
