const { logError } = require("../../utils/errorHandler");
const db = require("../../database");

class UserRepository {
	async findAll(orderBy = "ASC") {
		try {
			const direction = orderBy.toUpperCase() === "DESC" ? "DESC" : "ASC";
			const rows = await db.query(
				`SELECT
            id,
						name,
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
						name,
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
						name,
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

	async create({ name, email, password, status, admin }) {
		try {
			const [row] = await db.query(
				`
          INSERT INTO users
            (name, email, password, status, admin, datecreated)
          VALUES
            ($1, $2, $3, $4, $5, now())
          RETURNING id;
        `,
				[name, email, password, status, admin]
			);

			return row;
		} catch (error) {
			logError(error);
		}
	}

	async update(id, { name, email, password, status, admin }) {
		try {
			const [row] = await db.query(
				`
          UPDATE users
            SET name = $1,
						email = $2,
            password = $3,
            status = $4,
            admin = $5
          WHERE id = $6
          RETURNING id;
        `,
				[name, email, password, status, admin, id]
			);

			return row;
		} catch (error) {
			logError(error);
		}
	}
}

module.exports = new UserRepository();
