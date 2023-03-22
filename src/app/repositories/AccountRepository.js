const db = require("../../database");
const { logError } = require("../../utils/errorHandler");

class AccountRepository {
	async findAll(orderBy = "ASC") {
		try {
			const direction = orderBy.toUpperCase() === "DESC" ? "DESC" : "ASC";

			const rows = await db.query(`
				SELECT
					a.id ,
					a.id_customer as codCustomer,
					c.fantasyname as customerName,
					a.id_provider as codProvider,
					p.corporatename as providerName,
					a.id_person as codPerson,
					p2."name" as personName,
					a.id_account_classification ,
					ac.decription as descriptionAccount,
					a.id_account_type ,
					at2.decription as descriptionType,
					a."name" ,
					a.value ,
					a.expiration_date ,
					a.payment_date ,
					a.datecreated ,
					a.status
				FROM
					account a
				LEFT JOIN customer c ON c.id = a.id_customer
				LEFT JOIN provider p ON p.id = a.id_provider
				LEFT JOIN person p2 ON p2.id = a.id_person
				INNER JOIN account_classification ac ON ac.id = a.id_account_classification
				INNER JOIN account_type at2 ON at2.id = a.id_account_type
				ORDER BY a.id ${direction};
			`);

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

	async create(account) {
		try {
			const parsedAccountJson = JSON.stringify(account);

			const [row] = await db.query(
				`
					SELECT public.CreateAccount($1::json);
				`,
				[parsedAccountJson]
			);

			return row;
		} catch (error) {
			logError(error);
		}
	}

	async update(id, account) {
		try {
			const parsedAccountJson = JSON.stringify(account);

			const [row] = await db.query(
				`
					SELECT public.UpdateAccount($1::int, $2::json);
				`,
				[id, parsedAccountJson]
			);
			return row;
		} catch (error) {
			logError(error);
		}
	}

	async findAccountType() {
		try {
			const rows = await db.query(
				`
					SELECT * FROM account_type;
				`
			);
			return rows;
		} catch (error) {
			logError(error);
		}
	}

	async findAccountClassification() {
		try {
			const rows = await db.query(
				`
					SELECT * FROM account_classification;
				`
			);
			return rows;
		} catch (error) {
			logError(error);
		}
	}
}

module.exports = new AccountRepository();
