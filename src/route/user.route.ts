import { UserController } from '../controller/user.controller';
import requireUser from '../middleware/requireUser';

export const userRoute = [
  // {
  //   method: 'get',
  //   route: '/api/users',
  //   controller: UserController,
  //   action: 'all',
  // },
  // {
  //   method: 'get',
  //   route: '/api/users/:id',
  //   requireUser,
  //   controller: UserController,
  //   action: 'one',
  // },
  {
    method: 'post',
    route: '/api/users',
    controller: UserController,
    action: 'save',
  },
  // {
  //   method: 'delete',
  //   route: '/api/users/:id',
  //   controller: UserController,
  //   action: 'remove',
  // },

  {
    method: 'get',
    route: '/api/users/verify/:id/:verificationcode',
    controller: UserController,
    action: 'verify',
  },
  {
    method: 'post',
    route: '/api/users/forgot-password',
    controller: UserController,
    action: 'forgotPassword',
  },
  {
    method: 'put',
    route: '/api/users/resetpassword/:id/:passwordresetcode',
    controller: UserController,
    action: 'resetPassword',
  },
  {
    method: 'get',
    route: '/api/users/current-user',
    controller: UserController,
    action: 'me',
  },
];
