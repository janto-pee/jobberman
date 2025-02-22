import { ApplicantController } from '../controller/applicant.controller';

export const applicantRoute = [
  {
    method: 'get',
    route: '/api/applicants/:id',
    controller: ApplicantController,
    action: 'oneApplicant',
  },
  // {
  //   method: 'get',
  //   route: '/api/applicants',
  //   controller: ApplicantController,
  //   action: 'allApplicants',
  // },
];
