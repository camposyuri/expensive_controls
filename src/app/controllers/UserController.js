const UserRepository = require("../repositories/UserRepository");

class UserController {
  async index(request, response) {
    const users = await UserRepository.findAll();
    return response.json(users);
  }

  async show() {}

  async story() {}

  async update() {}
}

module.exports = new UserController();
