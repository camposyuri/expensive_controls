const db = require("../../database");

class UserRepository {
  async findAll(orderBy = "ASC") {
    const direction = orderBy.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const rows = await db.query(
      `SELECT 
          id, 
          email,
          datecreated,
          status 
        FROM users ORDER BY email ${direction};`
    );
    return rows;
  }

  async findId(id) {
    const [row] = await db.query(
      `
        SELECT
          id,
          email,
          datecreated,
          status
        FROM users
        WHERE id = $1
      `,
      [id]
    );
    return row;
  }

  async create() {}

  async update() {}
}

module.exports = new UserRepository();
