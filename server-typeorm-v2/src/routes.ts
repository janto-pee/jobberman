import { addressRoute } from './route/address.route';
import { authRoute } from './route/auth.route';
import { userRoute } from './route/user.route';

export const Routes = [
  ...userRoute,
  ...authRoute,
  ...addressRoute,
  // ...applicantRoute,
  // ...interviewRoute,
  // ...employerRoute,
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
