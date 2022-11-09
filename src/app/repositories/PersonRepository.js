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
					status,
					id_user
				FROM person ORDER BY id ${direction}
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
			const personJson = JSON.stringify(person);
			const [row] = await db.query(
				`
					SELECT public.CreatePerson($1::json);
				`,
				[personJson]
			);
			return row;
		} catch (error) {
			logError(error);
		}
	}

	async update(id, person) {
		try {
			const personJson = JSON.stringify(person);
			const [row] = await db.query(
				`
					SELECT public.UpdatePerson($1::int, $2::json);
				`,
				[id, personJson]
			);
			return row;
		} catch (error) {
			logError(error);
		}
	}
}

module.exports = new PersonRepository();
