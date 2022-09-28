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
						p.*,
						a.id AS address_id,
						a.publicplace,
					a."number",
					a.complement,
					a.district,
					a.county,
					a.zipcode,
					a.uf,
					a.id_person
				FROM
					person p
				INNER JOIN address a ON
					a.id_person = p.id
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

module.exports = new PersonRepository();
