import { EmployeerController } from '../controller/employer.controller';
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
