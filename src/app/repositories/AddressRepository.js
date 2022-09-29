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
					WHERE a.${columnName} = ${id};
				`
			);
			return row;
		} catch (error) {
			logError(error);
		}
	}
}

module.exports = new AddressRepository();
