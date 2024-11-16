import { AddressController } from '../controller/address.controller';

export const addressRoute = [
  {
    method: 'get',
    route: '/api/address',
    controller: AddressController,
    action: 'allAddress',
  },
  {
    method: 'get',
    route: '/api/address/:username',
    controller: AddressController,
    action: 'oneAddress',
  },
  {
    method: 'post',
    route: '/api/address/:username',
    controller: AddressController,
    action: 'saveAddress',
  },
  {
    method: 'put',
    route: '/api/address/:username',
    controller: AddressController,
    action: 'updateAddress',
  },
  {
    method: 'delete',
    route: '/api/address/:username',
    controller: AddressController,
    action: 'removeAddress',
  },
];
