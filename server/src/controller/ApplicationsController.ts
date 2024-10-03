import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Application } from "../entity/Applications";

export class ApplicationsController {
  private applicationRepository = AppDataSource.getRepository(Application);

  async allApplications(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    return this.applicationRepository.find();
  }

  async oneApplications(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const id = parseInt(request.params.id);

    const user = await this.applicationRepository.findOne({
      where: { id },
    });

    if (!user) {
      return "unregistered user";
    }
    return user;
  }

  async createApplications(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { username, applicant_is_active } = request.body;

    const user = Object.assign(new Application(), {
      username,
      applicant_is_active,
    });

    return this.applicationRepository.save(user);
  }

  async removeApplications(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const id = parseInt(request.params.id);

    let userToRemove = await this.applicationRepository.findOneBy({ id });

    if (!userToRemove) {
      return "this user not exist";
    }

    await this.applicationRepository.remove(userToRemove);

    return "user has been removed";
  }
}
