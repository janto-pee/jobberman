import { LocationController } from '../controller/Location.controller';

export const locationRoute = [
  {
    method: 'post',
    route: '/api/location',
    controller: LocationController,
    action: 'saveLocation',
  },
  {
    method: 'get',
    route: '/api/location',
    controller: LocationController,
    action: 'allLocations',
  },
  {
    method: 'get',
    route: '/api/location/:id',
    controller: LocationController,
    action: 'findLocation',
  },
  {
    method: 'put',
    route: '/api/location/:id',
    controller: LocationController,
    action: 'updateLocation',
  },

  {
    method: 'put',
    route: '/api/location/:id',
    controller: LocationController,
    action: 'deleteLocation',
  },
];
