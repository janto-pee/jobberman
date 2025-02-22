import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { User } from '../entity/User.entity';
import { Auth } from '../entity/Auth.entity';
import { comparePassword } from '../utils/hashpassword';
import { signJwt } from '../utils/jwt';
import config from 'config';
import { createSessionInput } from '../schema/auth.schema';
import { omit } from 'lodash';

export class AuthController {
  private authRepository = AppDataSource.getRepository(Auth);
  private userRepository = AppDataSource.getRepository(User);

  async saveAuth(
    request: Request<{}, {}, createSessionInput['body']>,
    response: Response,
  ) {
    try {
      const user = await this.userRepository.findOneBy({
        email: request.body.email,
      });

      if (!user) {
        response.status(400).send('invalid username or email');
        return;
      }

      const match = await comparePassword(
        request.body.password,
        user.hashed_password,
      );

      if (!match) {
        response.status(400).send('invalid email or password');
        return;
      }

      const userAgent = request.get('userAgent') || '';
      const res = omit(
        user,
        'hashed_password',
        'verificationCode',
        'passwordResetCode',
      );

      const auth = Object.assign(new Auth(), {
        userId: user.id,
        user_agent: userAgent,
      });
      const session = await this.authRepository.save(auth);

      const accessToken = signJwt(
        { ...res, session: session.id },
        'accessTokenPrivate',
        { expiresIn: config.get<string>('accessTokenTtl') },
      );

      const refreshToken = signJwt(
        { user: user.id, session: session.id },
        'refreshTokenPrivate',
        { expiresIn: config.get<string>('refreshTokenTtl') },
      );

      response.status(200).send({
        session,
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      return;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async findAuth(_, res: Response) {
    try {
      const id = res.locals.user.session;
      const session = await this.authRepository.findOneBy({
        id: id,
        valid: true,
      });
      res.status(201).json({
        status: true,
        message: 'session found',
        data: session,
      });
      return;
    } catch (error) {
      res.status(500).json({
        status: false,
        message: 'server error',
      });
    }
  }

  async deleteAuth(_, res: Response) {
    try {
      const id = res.locals.user.session;
      if (!id) {
        res.send('unuthorised');
      }
      res.locals.user = null;

      // update session to setvalid to false
      await this.authRepository.update(
        { id: id, valid: true },
        { valid: false },
      );
      res.status(201).json({
        status: true,
        message: 'session expired',
      });
    } catch (error) {
      //on error
      res.status(500).json({
        status: false,
        message: 'server error',
      });
    }
  }
}
