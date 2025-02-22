import { NotificationsController } from '../controller/Notifications.controller';

export const notificationRoute = [
  {
    method: 'post',
    route: '/api/notification',
    controller: NotificationsController,
    action: 'saveNotification',
  },
  {
    method: 'get',
    route: '/api/notification',
    controller: NotificationsController,
    action: 'allNotifications',
  },
  {
    method: 'get',
    route: '/api/notification/:id',
    controller: NotificationsController,
    action: 'oneNotification',
  },
];
