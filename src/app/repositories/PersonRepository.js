const db = require("../../database");
const { logError } = require("../../utils/errorHandler");

class PersonRepository {
	async findAll(orderBy = "ASC") {
		try {
			const direction = orderBy.toUpperCase() === "DESC" ? "DESC" : "ASC";
			const rows = await db.query(
				`SELECT
					id,
					name,
					cpfCnpj,
					rg,
					typePerson,
					birthdate,
					telephone,
					phone,
					dateCreated,
					status
				FROM person ORDER BY name ${direction}
				`
			);
			return rows;
		} catch (error) {
			logError(error);
		}
	}
}

module.exports = new PersonRepository();
