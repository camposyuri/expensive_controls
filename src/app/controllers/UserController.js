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

  async story(request, response) {
    try {
      const { email, password, status } = request.body;

      if (!email || !password)
        return response.status(400).json({ error: `Required information` });

      const user = await UserRepository.create({ email, password, status });
      return response.json(user);
    } catch (error) {
      next(error);
    }
  }

  async update(request, response) {
    try {
      const { id } = request.params;
      const { email, password, status } = request.body;

      const usersExists = await UserRepository.findId(id);

      if (!usersExists)
        return response.status(404).json({ error: "Users not found" });

      const user = await UserRepository.update(id, { email, password, status });
      return response.status(200).json({ success: "User" });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new UserController();
