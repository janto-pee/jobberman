import { addressRoute } from './route/address.route';
import { applicantRoute } from './route/applicant.route';
import { applicationRoute } from './route/application.route';
import { authRoute } from './route/auth.route';
import { employerRoute } from './route/employer.route';
import { finegrainedRoute } from './route/finegrained.route';
import { interviewRoute } from './route/interview.route';
import { jobRoute } from './route/job.route';
import { locationRoute } from './route/location.route';
import { metadataRoute } from './route/metadata.route';
import { probationRoute } from './route/probation.route';
import { ratingRoute } from './route/rating.route';
import { salaryRoute } from './route/salary.route';
import { taskbasedRoute } from './route/taskbased.route';
import { userRoute } from './route/user.route';

export const Routes = [
  ...userRoute,
  ...authRoute,
  ...addressRoute,
  ...applicantRoute,
  ...employerRoute,
  ...interviewRoute,
  ...applicationRoute,
  ...jobRoute,

  ...finegrainedRoute,
  ...locationRoute,
  ...metadataRoute,
  ...probationRoute,
  ...ratingRoute,
  ...salaryRoute,
  ...taskbasedRoute,
];
