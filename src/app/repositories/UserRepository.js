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

  async findById(id) {
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

  async create({ email, password, status }) {
    const [row] = await db.query(
      `
        INSERT INTO users 
          (email, password, status, datecreated)
        VALUES 
          ($1, $2, $3, now())
        RETURNING id;
      `,
      [email, password, status]
    );

    return row;
  }

  async update(id, { email, password, status }) {
    const [row] = await db.query(
      `
        UPDATE users
          SET email = $1,
          password = $2,
          status = $3
        WHERE id = $4
        RETURNING id;
      `,
      [email, password, status, id]
    );

    return row;
  }
}

module.exports = new UserRepository();
