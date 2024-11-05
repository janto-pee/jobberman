import { ApplicantController } from '../controller/applicant.controller';

export const applicantRoute = [
  {
    method: 'post',
    route: '/api/applicant',
    controller: ApplicantController,
    action: 'saveApplicant',
  },
  {
    method: 'get',
    route: '/api/applicants',
    controller: ApplicantController,
    action: 'allApplicants',
  },
  {
    method: 'get',
    route: '/api/applicant/:id',
    controller: ApplicantController,
    action: 'findApplicant',
  },
  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicantController,
    action: 'updateApplicant',
  },

  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicantController,
    action: 'deleteApplicant',
  },
];
