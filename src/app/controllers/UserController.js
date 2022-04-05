const { logError } = require("../../config/errorHandler");
const UserRepository = require("../repositories/UserRepository");

class UserController {
  async index(request, response, next) {
    try {
      const { orderBy } = request.query;

      const users = await UserRepository.findAll(orderBy);

      return response.json({ results: users });
    } catch (error) {
      next(error);
    }
  }

  async show(request, response, next) {
    try {
      const { id } = request.params;

      const user = await UserRepository.findId(id);
      response.json(user);
    } catch (error) {
      next(error);
    }
  }

  async story() {}

  async update() {}
}

module.exports = new UserController();
