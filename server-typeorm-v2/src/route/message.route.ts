import { MessageController } from '../controller/message.controller';

export const messageRoute = [
  {
    method: 'post',
    route: '/api/message',
    controller: MessageController,
    action: 'saveMessage',
  },
  {
    method: 'get',
    route: '/api/message',
    controller: MessageController,
    action: 'allMessages',
  },
  {
    method: 'get',
    route: '/api/message/:id',
    controller: MessageController,
    action: 'findMessage',
  },
  {
    method: 'put',
    route: '/api/message/:id',
    controller: MessageController,
    action: 'updateMessage',
  },

  {
    method: 'put',
    route: '/api/message/:id',
    controller: MessageController,
    action: 'deleteMessage',
  },
];
