import AppDataSource from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async allUsers(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async oneUser(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return "unregistered user";
    }
    return user;
  }

  async createUser(request: Request, response: Response, next: NextFunction) {
    const { first_name, last_name, email, address, address2, city, country } =
      request.body;

    const user = Object.assign(new User(), {
      first_name,
      last_name,
      email,
      address,
      address2,
      city,
      country,
    });

    return this.userRepository.save(user);
  }

  async removeUser(request: Request, response: Response, next: NextFunction) {
    const id = parseInt(request.params.id);

    let userToRemove = await this.userRepository.findOneBy({ id });

    if (!userToRemove) {
      return "this user not exist";
    }

    await this.userRepository.remove(userToRemove);

    return "user has been removed";
  }
}
