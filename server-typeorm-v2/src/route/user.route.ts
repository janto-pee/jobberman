import { UserController } from '../controller/user.controller';

export const userRoute = [
  {
    method: 'get',
    route: '/api/users',
    controller: UserController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/api/users/:id',
    controller: UserController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/api/users',
    controller: UserController,
    action: 'save',
  },
  {
    method: 'delete',
    route: '/api/users/:id',
    controller: UserController,
    action: 'remove',
  },

  {
    method: 'get',
    route: '/api/users/verify/:id/:verificationcode',
    controller: UserController,
    action: 'verify',
  },
  {
    method: 'post',
    route: '/api/users/forgotpassword',
    controller: UserController,
    action: 'forgotPassword',
  },
  {
    method: 'put',
    route: '/api/users/resetpassword/:id/:passwordresetcode',
    controller: UserController,
    action: 'resetPassword',
  },
];
