const db = require("../../database");
const { logError } = require("../../utils/errorHandler");

class AddressRepository {
	async findAddress(columnName, id) {
		try {
			const [row] = await db.query(
				`
					SELECT
						*
					FROM address a
					WHERE ${columnName} = $1;`,
				[id]
			);
			return row;
		} catch (error) {
			logError(error);
		}
	}
}

module.exports = new AddressRepository();
