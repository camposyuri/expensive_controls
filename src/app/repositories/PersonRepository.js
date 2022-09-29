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

	async findById(id) {
		try {
			const [row] = await db.query(
				`
					SELECT
						p.*
					FROM
						person p
					WHERE p.id = $1;
				`,
				[id]
			);
			return row;
		} catch (error) {
			logError(error);
		}
	}

	async create(person) {
		try {
			const param_json = JSON.stringify(person);
			const [row] = await db.query(
				`
					SELECT public.CreatePerson($1::json);
				`,
				[param_json]
			);
			return row;
		} catch (error) {
			logError(error);
		}
	}
}

module.exports = new PersonRepository();
