import { ApplicantController } from './controller/applicant.controller';
import { ApplicationController } from './controller/application.controller';
import { AuthController } from './controller/auth.controller';
import { EmployerController } from './controller/employer.controller';
import { UserController } from './controller/user.controller';

export const Routes = [
  {
    method: 'get',
    route: '/api/users',
    controller: UserController,
    action: 'all',
  },
  {
    method: 'get',
    route: '/api/users/:id',
    controller: UserController,
    action: 'one',
  },
  {
    method: 'post',
    route: '/api/users',
    controller: UserController,
    action: 'save',
  },
  {
    method: 'delete',
    route: '/api/users/:id',
    controller: UserController,
    action: 'remove',
  },

  {
    method: 'get',
    route: '/api/users/verify/:id/:verificationcode',
    controller: UserController,
    action: 'verify',
  },
  {
    method: 'post',
    route: '/api/users/forgotpassword',
    controller: UserController,
    action: 'forgotPassword',
  },
  {
    method: 'put',
    route: '/api/users/reset/:id/:passwordresetcode',
    controller: UserController,
    action: 'resetPassword',
  },
  // session
  {
    method: 'post',
    route: '/api/auth',
    controller: AuthController,
    action: 'saveAuth',
  },
  {
    method: 'get',
    route: '/api/auth',
    controller: AuthController,
    action: 'findAuth',
  },
  {
    method: 'put',
    route: '/api/auth',
    controller: AuthController,
    action: 'deleteAuth',
  },
  {
    method: 'post',
    route: '/api/employer',
    controller: EmployerController,
    action: 'saveEmployer',
  },
  {
    method: 'get',
    route: '/api/employer',
    controller: EmployerController,
    action: 'allEmployers',
  },
  {
    method: 'post',
    route: '/api/applicant',
    controller: ApplicantController,
    action: 'saveApplicant',
  },
  {
    method: 'get',
    route: '/api/applicant',
    controller: ApplicantController,
    action: 'allApplicants',
  },
  {
    method: 'get',
    route: '/api/applicant/:id',
    controller: ApplicantController,
    action: 'allApplicants',
  },
  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicantController,
    action: 'updateApplicants',
  },
  {
    method: 'delete',
    route: '/api/applicant',
    controller: ApplicantController,
    action: 'removeApplicant',
  },

  // application
  {
    method: 'post',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'saveApplicant',
  },
  {
    method: 'get',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'get',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'updateApplicants',
  },
  {
    method: 'delete',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'removeApplicant',
  },
  // fine grained
  {
    method: 'post',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'saveApplicant',
  },
  {
    method: 'get',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'get',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'updateApplicants',
  },
  {
    method: 'delete',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'removeApplicant',
  },

  // interview
  {
    method: 'post',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'saveApplicant',
  },
  {
    method: 'get',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'get',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'updateApplicants',
  },
  {
    method: 'delete',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'removeApplicant',
  },

  // job
  {
    method: 'post',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'saveApplicant',
  },
  {
    method: 'get',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'get',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'updateApplicants',
  },
  {
    method: 'delete',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'removeApplicant',
  },

  // location
  {
    method: 'post',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'saveApplicant',
  },
  {
    method: 'get',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'get',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'updateApplicants',
  },
  {
    method: 'delete',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'removeApplicant',
  },

  // messages
  {
    method: 'post',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'saveApplicant',
  },
  {
    method: 'get',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'get',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'updateApplicants',
  },
  {
    method: 'delete',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'removeApplicant',
  },

  // metadata
  {
    method: 'post',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'saveApplicant',
  },
  {
    method: 'get',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'get',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'updateApplicants',
  },
  {
    method: 'delete',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'removeApplicant',
  },

  // notfication
  {
    method: 'post',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'saveApplicant',
  },
  {
    method: 'get',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'get',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'updateApplicants',
  },
  {
    method: 'delete',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'removeApplicant',
  },

  // probation
  {
    method: 'post',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'saveApplicant',
  },
  {
    method: 'get',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'get',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'updateApplicants',
  },
  {
    method: 'delete',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'removeApplicant',
  },

  // ratings
  {
    method: 'post',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'saveApplicant',
  },
  {
    method: 'get',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'get',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'updateApplicants',
  },
  {
    method: 'delete',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'removeApplicant',
  },

  // salary
  {
    method: 'post',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'saveApplicant',
  },
  {
    method: 'get',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'get',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'updateApplicants',
  },
  {
    method: 'delete',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'removeApplicant',
  },

  // task grained
  {
    method: 'post',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'saveApplicant',
  },
  {
    method: 'get',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'get',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'allApplicants',
  },
  {
    method: 'put',
    route: '/api/applicant/:id',
    controller: ApplicationController,
    action: 'updateApplicants',
  },
  {
    method: 'delete',
    route: '/api/applicant',
    controller: ApplicationController,
    action: 'removeApplicant',
  },
];
