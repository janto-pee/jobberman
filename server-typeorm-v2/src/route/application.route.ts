import { ApplicationController } from '../controller/application.controller';
// upload and remove cover letter
export const applicationRoute = [
  {
    method: 'post',
    route: '/api/applications/:jobId',
    controller: ApplicationController,
    action: 'saveApplication',
  },
  {
    method: 'get',
    route: '/api/applications',
    controller: ApplicationController,
    action: 'allApplication',
  },
  {
    method: 'get',
    route: '/api/applications/:jobId',
    controller: ApplicationController,
    action: 'oneApplication',
  },
  {
    method: 'put',
    route: '/api/applications/:jobId',
    controller: ApplicationController,
    action: 'updateApplication',
  },

  {
    method: 'delete',
    route: '/api/applications/:jobId',
    controller: ApplicationController,
    action: 'removeApplication',
  },
];
