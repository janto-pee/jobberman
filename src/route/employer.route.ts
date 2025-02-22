import { EmployeerController } from '../controller/employer.controller';
// employer company

export const employerRoute = [
  {
    method: 'get',
    route: '/api/employers',
    controller: EmployeerController,
    action: 'allEmployers',
  },
  {
    method: 'get',
    route: '/api/employer/:id',
    controller: EmployeerController,
    action: 'oneEmployer',
  },
];
