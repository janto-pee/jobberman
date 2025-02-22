import { JobController } from '../controller/Job.controller';
// get job xyz
// get similar jobs
// get tbs jobs
// get fbs jobs
// get jobs with xyz ratings
// -- wishlist
// -- single wishlist

export const jobRoute = [
  {
    method: 'post',
    route: '/api/job/:employerId',
    controller: JobController,
    action: 'saveJob',
  },
  {
    method: 'get',
    route: '/api/job',
    controller: JobController,
    action: 'allJobs',
  },
  {
    method: 'get',
    route: '/api/job/:id',
    controller: JobController,
    action: 'oneJob',
  },
  {
    method: 'put',
    route: '/api/job/:id',
    controller: JobController,
    action: 'updateJob',
  },

  {
    method: 'put',
    route: '/api/job/:id',
    controller: JobController,
    action: 'removeJob',
  },
];
