import { addressRoute } from './route/address.route';
import { applicantRoute } from './route/applicant.route';
import { authRoute } from './route/auth.route';
import { employerRoute } from './route/employer.route';
import { userRoute } from './route/user.route';

export const Routes = [
  ...userRoute,
  ...authRoute,
  ...addressRoute,
  ...applicantRoute,
  ...employerRoute,
  // ...interviewRoute,
  // ...applicationRoute,
  // ...jobRoute,

  // ...finegrainedRoute,
  // ...locationRoute,
  // ...messageRoute,
  // ...metadataRoute,
  // ...probationRoute,
  // ...ratingRoute,
  // ...salaryRoute,
  // ...taskbasedRoute,
];
