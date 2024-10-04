import AppDataSource from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Person } from "../entity/Person";
import sendEmail from "../utils/sendemail";
import { nanoid } from "nanoid";

export class PersonService {
  private personRepository = AppDataSource.getRepository(Person);

  async allPersons() {
    try {
      const person = this.personRepository.find();
      return person;
    } catch (error) {
      return error;
    }
  }

  async onePerson(input: string) {
    try {
      const user = await this.personRepository.findOne({
        where: { username: input },
      });

      if (!user) {
        return "unregistered user";
      }
      return user;
    } catch (error) {
      return error;
    }
  }

  async createPerson(input: any) {
    try {
      const person = await this.personRepository.save(input);
      return person;
    } catch (error) {
      return error;
    }
  }

  async updatePerson(username: string, input: any) {
    try {
      let userToUpdate = await this.personRepository.findOneBy({ username });

      if (!userToUpdate) {
        return "user not found";
      }
      const user = await this.personRepository.save(input);
      return user;
    } catch (error) {
      return error;
    }
  }

  async removePerson(username: string) {
    try {
      let userToRemove = await this.personRepository.findOneBy({ username });

      if (!userToRemove) {
        return "this user does not exist";
      }

      await this.personRepository.remove(userToRemove);

      return "user has been removed";
    } catch (error) {
      return error;
    }
  }
}
