import AppDataSource from '../../data-source';
import { NextFunction, Request, response, Response } from 'express';
import { User } from '../entity/User';
import sendEmail from '../utils/sendemail';
import log from '../utils/logger';
import { customAlphabet } from 'nanoid';
import { Auth } from '../entity/Auth';
import { comparePassword } from '../utils/hashpassword';
import { signJwt } from '../utils/jwt';
import config from 'config';

export class AuthController {
  private authRepository = AppDataSource.getRepository(Auth);
  private userRepository = AppDataSource.getRepository(User);

  async saveAuth(request: Request, response: Response, next: NextFunction) {
    try {
      const user = await this.userRepository.findOneBy({
        email: request.body.email,
      });

      if (!user) {
        response.status(400).send('invalid username or email');
      }

      const match = await comparePassword(
        request.body.password,
        user.hashed_password,
      );

      if (!match) {
        return response.status(400).send('invalid username or email');
      }

      const userAgent = request.get('userAgent') || '';

      const auth = Object.assign(new Auth(), {
        userId: user.id,
        userAgent: userAgent,
        valid: true,
      });
      const session = await this.authRepository.save(auth);

      const accessToken = signJwt(
        { user: user.id, session: session.id },
        'accessTokenPrivate',
        { expiresIn: config.get<string>('accessTokenTtl') },
      );

      const refreshToken = signJwt(
        { user: user.id, session: session.id },
        'refreshTokenPrivate',
        { expiresIn: config.get<string>('refreshTokenTtl') },
      );

      return response.status(200).send({
        session,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async findAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.user.session;
      const session = await this.authRepository.findOneBy({
        id,
      });
      res.status(201).json({
        status: true,
        message: 'session found',
        data: session,
      });
      return;
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: 'server error',
      });
    }
  }

  async deleteAuth(req: Request, res: Response, next: NextFunction) {
    try {
      const id = res.locals.user.id;
      const session = await this.authRepository.findOneBy({
        id,
      });
      session.valid = false;
      const updatedSession = await this.authRepository.update(
        { id: id, valid: true },
        { valid: false },
      );
      res.status(201).json({
        status: true,
        message: 'session expired',
        data: updatedSession,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        status: false,
        message: 'server error',
      });
    }
  }
}
