import { FineGrainedController } from '../controller/FineGrained.controller';

export const finegrainedRoute = [
  {
    method: 'post',
    route: '/api/finegrained',
    controller: FineGrainedController,
    action: 'saveFineGrained',
  },
  {
    method: 'get',
    route: '/api/finegrained',
    controller: FineGrainedController,
    action: 'allFineGraineds',
  },
  {
    method: 'get',
    route: '/api/finegrained/:id',
    controller: FineGrainedController,
    action: 'findFineGrained',
  },
  {
    method: 'put',
    route: '/api/finegrained/:id',
    controller: FineGrainedController,
    action: 'updateFineGrained',
  },

  {
    method: 'put',
    route: '/api/finegrained/:id',
    controller: FineGrainedController,
    action: 'deleteFineGrained',
  },
];
