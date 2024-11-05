import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { User } from '../entity/User.entity';
import sendEmail from '../utils/sendemail';
import log from '../utils/logger';
import { customAlphabet } from 'nanoid';
import {
  createUserInput,
  forgotPasswordInput,
  resetPasswordInput,
  verifyParam,
} from '../schema/user.schema';
import { omit } from 'lodash';
import { Applicant } from '../entity/Applicants.entity';
import { Employer } from '../entity/Employer.entity';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private applicantRepository = AppDataSource.getRepository(Applicant);
  private employerRepository = AppDataSource.getRepository(Employer);

  async all(_: Request, response: Response) {
    try {
      const users = await this.userRepository.find();
      response.status(201).json({
        status: true,
        message: `user successfully fetched`,
        data: users,
      });
      return;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async one(request: Request, response: Response) {
    try {
      const id = request.params.id;

      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        return 'unregistered user';
      }
      return user;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async save(
    request: Request<{}, {}, createUserInput['body']>,
    response: Response,
  ) {
    try {
      const user = Object.assign(new User(), {
        ...request.body,
      });

      const savedUser = await this.userRepository.save(user);
      // save aplicnt data too
      const applicant = Object.assign(new Applicant(), {
        user: user,
        isActive: true,
      });
      const employer = Object.assign(new Employer(), {
        user: user,
        isActive: true,
      });

      let savedEmployerorApplicant;
      if (request.body.role == 'employer') {
        savedEmployerorApplicant = await this.employerRepository.save({
          ...employer,
          user: user,
        });
      } else {
        savedEmployerorApplicant = await this.applicantRepository.save({
          ...applicant,
          user: user,
        });
      }
      const res = omit(savedUser, 'hashed_password');
      console.log(savedEmployerorApplicant);

      await sendEmail({
        from: `"Jobby Recruitment Platform 👻" <lakabosch@gmail.com>`,
        to: user.email,
        subject: 'Kindly verify your email ✔',
        text: `click on the link http://localhost:1337/api/users/verify/${savedUser.id}/${savedUser.verificationCode}`,
        html: `<b>Hello, click on the link http://localhost:1337/api/users/verify/${savedUser.id}/${savedUser.verificationCode}</b>`,
      });

      response.status(201).json({
        status: true,
        message: `user successfully created click on the link http://localhost:1337/api/users/verify/${savedUser.id}/${savedUser.verificationCode}`,
        data: res,
      });
      return;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async verify(request: Request<verifyParam>, response: Response) {
    try {
      const { id, verificationcode } = request.params;

      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (!user) {
        return 'unregistered user';
      }

      if (user.is_email_verified) {
        return 'user already verified';
      }

      if (user.verificationCode === verificationcode) {
        user.is_email_verified = true;
        await this.userRepository.save(user);
        response.status(201).json({ status: 'user registered successfully' });
        return;
      }
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async forgotPassword(
    request: Request<{}, {}, forgotPasswordInput['body']>,
    response: Response,
  ) {
    try {
      const nanoid = customAlphabet('1234567890abcdef', 10);
      const { email } = request.body;

      const user = await this.userRepository.findOne({
        where: { email },
      });

      if (!user) {
        log.debug('user not found');
        return;
      }

      if (!user.is_email_verified) {
        return response.send(
          'user not verified, please check your email to verify',
        );
      }

      const pRC = nanoid();
      user.passwordResetCode = pRC;
      const savedUser = await this.userRepository.save(user);

      await sendEmail({
        from: `"Jobby Recruitment Platform 👻" <lakabosch@gmail.com>`,
        to: user.email,
        subject: 'Kindly verify your email ✔',
        text: `click on the link http://localhost:1337/api/users/resetpassword/${savedUser.id}/${savedUser.passwordResetCode}`,
        html: `<b>Hello, click on the link http://localhost:1337/api/users/resetpassword/${savedUser.id}/${savedUser.passwordResetCode}</b>`,
      });

      response.status(201).json({
        status: true,
        message: `check your email to reset password  http://localhost:1337/api/users/resetpassword/${savedUser.id}/${savedUser.passwordResetCode}`,
      });
      return;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async resetPassword(
    request: Request<
      resetPasswordInput['params'],
      {},
      resetPasswordInput['body']
    >,
    response: Response,
  ) {
    try {
      const { id, passwordresetcode } = request.params;
      const { password } = request.body;

      const user = await this.userRepository.findOne({
        where: { id },
      });

      if (
        !user ||
        !user.passwordResetCode ||
        user.passwordResetCode !== passwordresetcode
      ) {
        return response.status(400).send('error resetting password');
      }

      if (!user.is_email_verified) {
        return response.send(
          'user not verified, please check your email to verify',
        );
      }
      user.passwordResetCode = null;
      user.hashed_password = password;
      const savedUser = await this.userRepository.save(user);
      const res = omit(savedUser, 'hashed_password');

      response.status(201).json({
        status: true,
        message: 'password changed successfully',
        data: res,
      });
      return;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async remove(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;

      const userToRemove = await this.userRepository.findOneBy({ id });

      if (!userToRemove) {
        return 'this user not exist';
      }

      await this.userRepository.remove(userToRemove);

      response.status(201).send('user deleted successfully');
      return;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async updateUser(request: Request, response: Response) {
    try {
      const { username } = request.params;

      const userToUpdate = await this.userRepository.findOneBy({
        username: username,
      });
      userToUpdate.first_name = request.body.first_name;
      const savedUser = await this.userRepository.save(userToUpdate);

      response
        .status(201)
        .json({ status: 'user updated successfully', data: savedUser });
      return;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async removeUser(request: Request<{ username: string }>, response: Response) {
    try {
      const username = request.params.username;

      const userToRemove = await this.userRepository.findOneBy({
        username: username,
      });
      if (userToRemove) {
        return 'this user does not exist';
      }
      let applicantToRemove = await this.applicantRepository.findOneBy({
        user: { username },
      });
      if (applicantToRemove) {
        await this.applicantRepository.remove(applicantToRemove);
      } else {
        const employerToRemove = await this.employerRepository.findOneBy({
          user: { username },
        });
        await this.employerRepository.remove(employerToRemove);
      }

      await this.userRepository.remove(userToRemove);

      response.status(201).send('applicant deleted successfully');
      return;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }
}
