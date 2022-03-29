const db = require("../../database");

class UserRepository {
  async findAll() {
    const rows = await db.query(`SELECT * FROM users;`);
    return rows;
  }

  async findId() {}

  async create() {}

  async update() {}
}

module.exports = new UserRepository();
