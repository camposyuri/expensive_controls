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
            status 
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
            status
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
            status
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

  async create({ email, password, status }) {
    try {
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
    } catch (error) {
      logError(error);
    }
  }

  async update(id, { email, password, status }) {
    try {
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
    } catch (error) {
      logError(error);
    }
  }
}

module.exports = new UserRepository();
