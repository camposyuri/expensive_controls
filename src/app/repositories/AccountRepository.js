const db = require("../../database");
const { logError } = require("../../utils/errorHandler");

class AccountRepository {
	async findAll(orderBy = "ASC") {
		try {
			const direction = orderBy.toUpperCase() === "DESC" ? "DESC" : "ASC";

			const rows = await db.query(
				`
					SELECT
						id ,
						id_customer ,
						id_provider ,
						id_person ,
						id_account_classification ,
						id_account_type ,
						"name" ,
						value ,
						expiration_date ,
						payment_date ,
						datecreated ,
						status
					FROM
						account a
					ORDER BY id ${direction};
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
						id ,
						id_customer ,
						id_provider ,
						id_person ,
						id_account_classification ,
						id_account_type ,
						"name" ,
						value ,
						expiration_date ,
						payment_date ,
						datecreated ,
						status
					FROM
						account
					WHERE id = $1;
				`,
				[id]
			);

			return row;
		} catch (error) {
			logError(error);
		}
	}
}

module.exports = new AccountRepository();
