import { ApplicationController } from '../controller/application.controller';

export const applicationRoute = [
  {
    method: 'post',
    route: '/api/application/:jobId/:applicantId',
    controller: ApplicationController,
    action: 'saveApplication',
  },
  {
    method: 'get',
    route: '/api/application',
    controller: ApplicationController,
    action: 'allApplications',
  },
  {
    method: 'get',
    route: '/api/application/:id',
    controller: ApplicationController,
    action: 'oneApplication',
  },
  {
    method: 'put',
    route: '/api/application/:id',
    controller: ApplicationController,
    action: 'updateApplication',
  },

  {
    method: 'put',
    route: '/api/application/:id',
    controller: ApplicationController,
    action: 'removeApplication',
  },
];
