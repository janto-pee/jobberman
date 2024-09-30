import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Person } from "../entity/Persons";

export class PersonController {
  private personRepository = AppDataSource.getRepository(Person);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.personRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const username = request.params.username;

    const user = await this.personRepository.findOne({
      where: { username },
    });

    if (!user) {
      return "unregistered user";
    }
    return user;
  }

  async save(request: Request, response: Response, next: NextFunction) {
    const { firstName, lastName, age } = request.body;

    const user = Object.assign(new Person(), {
      firstName,
      lastName,
      age,
    });

    return this.personRepository.save(user);
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { firstName, lastName, age } = request.body;
    const username = request.params.username;
    let userToRemove = await this.personRepository.findOneBy({ username });

    const user = Object.assign(new Person(), {
      firstName,
      lastName,
      age,
    });

    return this.personRepository.save(user);
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    const username = request.params.username;

    let userToRemove = await this.personRepository.findOneBy({ username });

    if (!userToRemove) {
      return "this user not exist";
    }

    await this.personRepository.remove(userToRemove);

    return "user has been removed";
  }
}
