import { EmployerController } from '../controller/employer.controller';

export const employerRoute = [
  {
    method: 'post',
    route: '/api/employer',
    controller: EmployerController,
    action: 'saveEmployer',
  },
  {
    method: 'get',
    route: '/api/employer',
    controller: EmployerController,
    action: 'allEmployers',
  },
  {
    method: 'get',
    route: '/api/employer/:id',
    controller: EmployerController,
    action: 'findEmployer',
  },
  {
    method: 'put',
    route: '/api/employer/:id',
    controller: EmployerController,
    action: 'updateEmployer',
  },

  {
    method: 'put',
    route: '/api/employer/:id',
    controller: EmployerController,
    action: 'deleteEmployer',
  },
];
