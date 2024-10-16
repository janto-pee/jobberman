import { AuthController } from './controller/AuthController';
import { UserController } from './controller/UserController';

export const Routes = [
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
    route: '/api/users/reset/:id/:passwordresetcode',
    controller: UserController,
    action: 'resetPassword',
  },
  // session
  {
    method: 'post',
    route: '/api/auth',
    controller: AuthController,
    action: 'saveAuth',
  },
  {
    method: 'get',
    route: '/api/auth',
    controller: AuthController,
    action: 'findAuth',
  },
  {
    method: 'put',
    route: '/api/auth',
    controller: AuthController,
    action: 'deleteAuth',
  },
];
