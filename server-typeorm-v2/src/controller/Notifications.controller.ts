import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Notification } from '../entity/Notifications.entity';

export class NotificationsController {
  private notificationRepository = AppDataSource.getRepository(Notification);

  async allNotifications(_: Request, response: Response) {
    try {
      const notifications = this.notificationRepository.find();
      response.status(201).json({
        status: true,
        message: `notification successfully fetched`,
        data: notifications,
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

  async oneNotifications(request: Request, response: Response) {
    try {
      const id = request.params.id;

      const notification = await this.notificationRepository.findOne({
        where: { id },
      });

      if (!notification) {
        return 'unregistered notification';
      }
      return notification;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async saveNotifications(request: Request, response: Response) {
    try {
      const notification = Object.assign(new Notification(), {
        ...request.body,
      });

      const savedNotification =
        await this.notificationRepository.save(notification);
      response.status(201).json({
        status: true,
        message: `notification successfully created click on the`,
        data: savedNotification,
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

  async removeNotifications(
    request: Request<{ id: string }>,
    response: Response,
  ) {
    try {
      const id = request.params.id;

      const notificationToRemove = await this.notificationRepository.findOneBy({
        id,
      });

      if (!notificationToRemove) {
        return 'this notification not exist';
      }

      await this.notificationRepository.remove(notificationToRemove);

      response.status(201).send('notification deleted successfully');
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
