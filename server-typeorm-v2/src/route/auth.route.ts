import { AuthController } from '../controller/auth.controller';

export const authRoute = [
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
