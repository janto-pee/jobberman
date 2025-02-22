import { InterviewController } from '../controller/Interview.controller';

export const interviewRoute = [
  {
    method: 'post',
    route: '/api/interview/:jobId/:applicantId/:applicationId',
    controller: InterviewController,
    action: 'saveInterview',
  },
  {
    method: 'get',
    route: '/api/interview',
    controller: InterviewController,
    action: 'allInterviews',
  },
  {
    method: 'get',
    route: '/api/interview/:id',
    controller: InterviewController,
    action: 'oneInterview',
  },
  {
    method: 'put',
    route: '/api/interview/:id',
    controller: InterviewController,
    action: 'updateInterview',
  },

  {
    method: 'put',
    route: '/api/interview/:id',
    controller: InterviewController,
    action: 'removeInterview',
  },
];
