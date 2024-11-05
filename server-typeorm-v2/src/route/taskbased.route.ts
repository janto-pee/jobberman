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
    action: 'allTaskBaseds',
  },
  {
    method: 'get',
    route: '/api/taskbased/:id',
    controller: TaskBasedController,
    action: 'findTaskBased',
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
    action: 'deleteTaskBased',
  },
];
