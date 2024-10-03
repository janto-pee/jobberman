import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Person } from "../entity/Persons";
import sendEmail from "../utils/sendemail";

export class PersonController {
  private personRepository = AppDataSource.getRepository(Person);

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
    try {
      const { firstName, lastName, password, username } = request.body;

      const user = Object.assign(new Person(), {
        firstName,
        lastName,
        password,
        username,
      });

      //hash password

      this.personRepository.save(user);

      // send verify email
      sendEmail({
        from: `"Jobby Recruitment Platform 👻" <noreply@jobbyrecruitment.com>`,
        to: user.email,
        subject: "Kindly verify your email ✔",
        text: `verification code: ${user.verificationCode}. username: ${user.username}`,
        html: "<b>Hello world?</b>",
      });
      return response.send("user successfully created");
    } catch (error) {
      if (error.code === 11000) {
        return response.status(409).send("Account already exists");
      }
      return response.send(error);
    }
  }

  async update(request: Request, response: Response, next: NextFunction) {
    const { firstName, lastName, age } = request.body;
    const username = request.params.username;
    let userToRemove = await this.personRepository.findOneBy({ username });

    if (!userToRemove) {
      return "user not found";
    }

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

  // verify user
  async verifyUser(request: Request, response: Response, next: NextFunction) {
    const { username, verificationCode } = request.params;

    let userToVerify = await this.personRepository.findOneBy({ username });

    if (!userToVerify) {
      return "this user not exist";
    }

    await this.personRepository.remove(userToVerify);

    return "user has been Verifyd";
  }

  // forgot password

  // resetpasswordhandler
}
