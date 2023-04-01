const db = require("../../database");
const { logError } = require("../../utils/errorHandler");

class SignInRepository {
	async findByEmail(email) {
		try {
			const [row] = await db.query(
				`
					SELECT
						id,
						name,
						email,
						password,
						status,
						admin,
						sub
					FROM users
					WHERE email = $1
					LIMIT 1;
				`,
				[email]
			);

			return row;
		} catch (error) {
			logError(error);
		}
	}
}

module.exports = new SignInRepository();
