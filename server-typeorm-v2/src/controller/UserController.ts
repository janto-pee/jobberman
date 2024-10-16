import AppDataSource from '../../data-source';
import { NextFunction, Request, response, Response } from 'express';
import { User } from '../entity/User';
import sendEmail from '../utils/sendemail';
import log from '../utils/logger';
import { customAlphabet } from 'nanoid';
import {
  createUserInput,
  forgotPasswordInput,
  resetPasswordInput,
  verifyParam,
} from '../schema/UserSchema';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);

  async all(request: Request, response: Response, next: NextFunction) {
    return this.userRepository.find();
  }

  async one(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;

    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      return 'unregistered user';
    }
    return user;
  }

  async save(
    request: Request<{}, {}, createUserInput['body']>,
    response: Response,
    next: NextFunction,
  ) {
    try {
      const user = Object.assign(new User(), {
        ...request.body,
      });

      const savedUser = await this.userRepository.save(user);

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
        data: savedUser,
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

  async verify(
    request: Request<verifyParam>,
    response: Response,
    next: NextFunction,
  ) {
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
    next: NextFunction,
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
        text: `click on the link http://localhost:1337/api/users/verify/${savedUser.id}/${savedUser.passwordResetCode}`,
        html: `<b>Hello, click on the link http://localhost:1337/api/users/verify/${savedUser.id}/${savedUser.passwordResetCode}</b>`,
      });

      response.status(201).json({
        status: true,
        message: `check your email to reset password  http://localhost:1337/api/users/verify/${savedUser.id}/${savedUser.passwordResetCode}`,
        data: savedUser,
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
    next: NextFunction,
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

      response.status(201).json({
        status: true,
        message: 'password changed successfully',
        data: savedUser,
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

  async remove(
    request: Request<{ id: string }>,
    response: Response,
    next: NextFunction,
  ) {
    const id = request.params.id;

    let userToRemove = await this.userRepository.findOneBy({ id });

    if (!userToRemove) {
      return 'this user not exist';
    }

    await this.userRepository.remove(userToRemove);

    return 'user has been removed';
  }
}
