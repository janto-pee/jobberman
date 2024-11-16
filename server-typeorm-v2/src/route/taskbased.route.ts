import { TaskBasedController } from '../controller/TaskBased.controller';

export const taskbasedRoute = [
  {
    method: 'post',
    route: '/api/taskbased',
    controller: TaskBasedController,
    action: 'saveTaskBased',
  },
  {
    method: 'get',
    route: '/api/taskbased',
    controller: TaskBasedController,
    action: 'allTaskBased',
  },
  {
    method: 'get',
    route: '/api/taskbased/:id',
    controller: TaskBasedController,
    action: 'oneTaskBased',
  },
  {
    method: 'put',
    route: '/api/taskbased/:id',
    controller: TaskBasedController,
    action: 'updateTaskBased',
  },

  {
    method: 'put',
    route: '/api/taskbased/:id',
    controller: TaskBasedController,
    action: 'removeTaskBased',
  },
];
