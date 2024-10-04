import AppDataSource from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Notification } from "../entity/Notification";

export class NotificationController {
  private NotificationRepository = AppDataSource.getRepository(Notification);

  async allNotifications(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    return this.NotificationRepository.find();
  }

  async oneNotification(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const id = request.params.id;

    const user = await this.NotificationRepository.findOne({
      where: { id },
    });

    if (!user) {
      return "unregistered user";
    }
    return user;
  }

  async saveNotification(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { sender_username, reciever_username, content } = request.body;

    const user = Object.assign(new Notification(), {
      sender_username,
      reciever_username,
      content,
    });

    return this.NotificationRepository.save(user);
  }

  async updateNotification(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { sender_username, reciever_username, content } = request.body;
    const id = request.params.id;
    let NotificationToUpdate = await this.NotificationRepository.findOneBy({
      id,
    });
    if (!NotificationToUpdate) {
      return "this user does not exist";
    }

    const user = Object.assign(new Notification(), {
      sender_username,
      reciever_username,
      content,
    });

    return this.NotificationRepository.save(user);
  }

  async removeNotification(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const id = request.params.id;

    let NotificationToRemove = await this.NotificationRepository.findOneBy({
      id,
    });

    if (!NotificationToRemove) {
      return "this Notification does not exist";
    }

    await this.NotificationRepository.remove(NotificationToRemove);

    return "Notification has been removed";
  }
}
