import { ProbationController } from '../controller/Probation.controller';

export const probationRoute = [
  {
    method: 'post',
    route: '/api/probation',
    controller: ProbationController,
    action: 'saveProbation',
  },
  {
    method: 'get',
    route: '/api/probation',
    controller: ProbationController,
    action: 'allProbations',
  },
  {
    method: 'get',
    route: '/api/probation/:id',
    controller: ProbationController,
    action: 'findProbation',
  },
  {
    method: 'put',
    route: '/api/probation/:id',
    controller: ProbationController,
    action: 'updateProbation',
  },

  {
    method: 'put',
    route: '/api/probation/:id',
    controller: ProbationController,
    action: 'deleteProbation',
  },
];
