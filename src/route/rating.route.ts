import { RatingController } from '../controller/ratings.controller';

export const ratingRoute = [
  {
    method: 'post',
    route: '/api/rating',
    controller: RatingController,
    action: 'saveRating',
  },
  {
    method: 'get',
    route: '/api/rating',
    controller: RatingController,
    action: 'allRatings',
  },
  {
    method: 'get',
    route: '/api/rating/:id',
    controller: RatingController,
    action: 'oneRating',
  },
  {
    method: 'put',
    route: '/api/rating/:id',
    controller: RatingController,
    action: 'updateRating',
  },

  {
    method: 'put',
    route: '/api/rating/:id',
    controller: RatingController,
    action: 'removeRating',
  },
];
