import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Person } from "../entity/Persons";
import sendEmail from "../utils/sendemail";
import { nanoid } from "nanoid";

export class PersonController {
  private personRepository = AppDataSource.getRepository(Person);

  async onePerson(request: Request, response: Response, next: NextFunction) {
    const username = request.params.username;

    const user = await this.personRepository.findOne({
      where: { username },
    });

    if (!user) {
      return "unregistered user";
    }
    return user;
  }

  async savePerson(request: Request, response: Response, next: NextFunction) {
    const verification = nanoid();

    try {
      const {
        username,
        hashed_password,
        first_name,
        last_name,
        email,
        address,
        address2,
        city,
        country,
        is_email_verified,
        pasword_changed,
      } = request.body;

      const user = Object.assign(new Person(), {
        username,
        hashed_password,
        first_name,
        last_name,
        email,
        address,
        address2,
        city,
        country,
        is_email_verified,

        pasword_changed,
      });
      user.verificationCode = verification;

      //hash password in model
      await this.personRepository.save(user);

      // send verify email
      await sendEmail({
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

  async updatePerson(request: Request, response: Response, next: NextFunction) {
    try {
      const { first_name, last_name, email, address, address2, city, country } =
        request.body;
      const username = request.params.username;
      let userToUpdate = await this.personRepository.findOneBy({ username });

      if (!userToUpdate) {
        return "user not found";
      }

      (userToUpdate.username = username),
        (userToUpdate.first_name = first_name),
        (userToUpdate.last_name = last_name),
        (userToUpdate.email = email),
        (userToUpdate.address = address),
        (userToUpdate.address2 = address2),
        (userToUpdate.city = city),
        (userToUpdate.country = country),
        await this.personRepository.save(userToUpdate);
      return response.send("profile successfully updated");
    } catch (error) {
      response.send(error);
    }
  }

  async remove(request: Request, response: Response, next: NextFunction) {
    try {
      const username = request.params.username;

      let userToRemove = await this.personRepository.findOneBy({ username });

      if (!userToRemove) {
        return response.send("this user does not exist");
      }

      await this.personRepository.remove(userToRemove);

      return response.send("user has been removed");
    } catch (error) {
      response.send(error);
    }
  }

  // verify user
  async verifyUser(request: Request, response: Response, next: NextFunction) {
    try {
      const { username, verificationCode } = request.params;
      let userToVerify = await this.personRepository.findOneBy({ username });

      if (!userToVerify) {
        return "this user not exist";
      }

      if (userToVerify.is_email_verified) {
        return "email already verified";
      }

      if (userToVerify.verificationCode === verificationCode) {
        userToVerify.is_email_verified = true;
        await this.personRepository.save(userToVerify);
        return "email successfully verified";
      }
    } catch (error) {
      return response.send(error);
    }
  }

  // forgot password
  async forgotPassword(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const message = "please check your email address";
    try {
      const { email } = request.body;
      let user = await this.personRepository.findOneBy({ email });

      if (!user) {
        return "user does not exist";
      }

      if (!user.is_email_verified) {
        return response.send("please verify your email");
      }

      const pRC = nanoid();
      user.passwordResetCode = pRC;
      await this.personRepository.save(user);
      await sendEmail({
        from: `"Jobby Recruitment Platform 👻" <noreply@jobbyrecruitment.com>`,
        to: user.email,
        subject: "Kindly reset your password with code ✔",
        text: `password reset code: ${user.passwordResetCode}. username: ${user.username}`,
        html: "<b>Hello world?</b>",
      });
      return response.send(message);
    } catch (error) {
      return response.send(error);
    }
  }

  // reset password handler
  async resetPassword(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const message = "please check your email address";
    try {
      const { username, passwordResetCode } = request.params;
      const { password } = request.body;
      let user = await this.personRepository.findOneBy({ username });

      if (
        !user ||
        !user.passwordResetCode ||
        user.passwordResetCode !== passwordResetCode
      ) {
        return response.status(400);
      }
      user.passwordResetCode = null;
      user.hashed_password = password;
      await this.personRepository.save(user);
      await sendEmail({
        from: `"Jobby Recruitment Platform 👻" <noreply@jobbyrecruitment.com>`,
        to: user.email,
        subject: "Password Change Notification ✔",
        text: `a password changed recently occurred on your account`,
        html: "<b>Hello world?</b>",
      });
      return response.send(message);
    } catch (error) {
      return response.send(error);
    }
  }
}
