import { SalaryController } from '../controller/salary.controller';

export const salaryRoute = [
  {
    method: 'post',
    route: '/api/salary',
    controller: SalaryController,
    action: 'saveSalary',
  },
  {
    method: 'get',
    route: '/api/salary',
    controller: SalaryController,
    action: 'allSalarys',
  },
  {
    method: 'get',
    route: '/api/salary/:id',
    controller: SalaryController,
    action: 'findSalary',
  },
  {
    method: 'put',
    route: '/api/salary/:id',
    controller: SalaryController,
    action: 'updateSalary',
  },

  {
    method: 'put',
    route: '/api/salary/:id',
    controller: SalaryController,
    action: 'deleteSalary',
  },
];
