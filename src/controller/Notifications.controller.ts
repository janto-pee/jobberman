import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Notification } from '../entity/Notifications.entity';

export class NotificationsController {
  private notificationRepository = AppDataSource.getRepository(Notification);
  async allNotifications(_: Request, response: Response) {
    try {
      const Notification = await this.notificationRepository.find();
      response.status(201).json({
        status: true,
        message: `user successfully fetched`,
        data: Notification,
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

  async oneNotification(request: Request, response: Response) {
    try {
      const Notification = await this.notificationRepository.findOne({
        where: {
          id: request.params.id,
        },
      });

      if (!Notification) {
        return 'no Notification';
      }
      return Notification;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async saveNotification(request: Request, response: Response) {
    try {
      const address = Object.assign(new Notification(), {
        ...request.body,
      });

      const savedAddress = await this.notificationRepository.save({
        ...address,
      });

      response.status(201).json({
        status: true,
        message: `address updated successfully`,
        data: savedAddress,
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
}
