const { logError } = require("../../utils/errorHandler");
const db = require("../../database");

class UserRepository {
	async findAll(orderBy = "ASC") {
		try {
			const direction = orderBy.toUpperCase() === "DESC" ? "DESC" : "ASC";
			const rows = await db.query(
				`SELECT
            id,
            email,
            datecreated,
            status,
            admin
          FROM users ORDER BY email ${direction};`
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
            id,
            email,
            datecreated,
            status,
            admin
          FROM users
          WHERE id = $1
        `,
				[id]
			);
			return row;
		} catch (error) {
			logError(error);
		}
	}

	async findByEmail(email) {
		try {
			const [row] = await db.query(
				`
          SELECT
            id,
            email,
            status,
            admin
          FROM users
          WHERE email = $1;
        `,
				[email]
			);
			return row;
		} catch (error) {
			logError(error);
		}
	}

	async create({ email, password, status, admin }) {
		try {
			const [row] = await db.query(
				`
          INSERT INTO users
            (email, password, status, admin, datecreated)
          VALUES
            ($1, $2, $3, $4, now())
          RETURNING id;
        `,
				[email, password, status, admin]
			);

			return row;
		} catch (error) {
			logError(error);
		}
	}

	async update(id, { email, password, status, admin }) {
		try {
			const [row] = await db.query(
				`
          UPDATE users
            SET email = $1,
            password = $2,
            status = $3,
            admin = $4
          WHERE id = $5
          RETURNING id;
        `,
				[email, password, status, admin, id]
			);

			return row;
		} catch (error) {
			logError(error);
		}
	}
}

module.exports = new UserRepository();
