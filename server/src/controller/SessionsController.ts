import AppDataSource from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Sessions } from "../entity/Sessions";

export class SessionController {
  private sessionRepository = AppDataSource.getRepository(Sessions);

  async createSession(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { username, user_agent, client_ip, is_blocked } = request.body;

    const session = Object.assign(new Sessions(), {
      username,
      user_agent,
      client_ip,
      is_blocked,
    });

    return this.sessionRepository.save(session);
  }
  async findSession(request: Request, response: Response, next: NextFunction) {
    const { username, user_agent, client_ip, is_blocked } = request.body;

    const session = Object.assign(new Sessions(), {
      username,
      user_agent,
      client_ip,
      is_blocked,
    });

    return this.sessionRepository.save(session);
  }
  async updateSession(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const id = response.locals.user.session;

    let userToRemove = await this.sessionRepository.findOneBy({ id });

    if (!userToRemove) {
      return "this user not exist";
    }

    await this.sessionRepository.update(userToRemove, { valid: false });

    return "user has been removed";
  }
  async reIssueAccessToken(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { username, user_agent, client_ip, is_blocked } = request.body;

    const session = Object.assign(new Sessions(), {
      username,
      user_agent,
      client_ip,
      is_blocked,
    });

    return this.sessionRepository.save(session);
  }
}
