import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Location } from '../entity/Location.entity';

export class LocationController {
  private locationRepository = AppDataSource.getRepository(Location);

  async allLocations(_: Request, response: Response) {
    try {
      const location = await this.locationRepository.find({
        relations: {
          address: true,
        },
      });
      response.status(201).json({
        status: true,
        message: `all locations`,
        data: location,
      });
      return;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async oneLocation(request: Request, response: Response) {
    try {
      const id = request.params.id;
      const location = await this.locationRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          address: true,
        },
      });
      response.status(201).json({
        status: true,
        message: `location found`,
        data: location,
      });
      return;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async saveLocation(request: Request, response: Response) {
    try {
      const address = await this.locationRepository.findOne({
        where: { id: request.params.addressId },
      });
      if (!address) {
        response.status(201).json({
          status: 'error',
          message: `address not found`,
        });
        return;
      }
      const savedAddress = await this.locationRepository.save({
        ...request.body,
      });
      response.status(201).json({
        status: true,
        message: `location created successfully`,
        data: savedAddress,
      });
      return;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async updateLocation(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const location = await this.locationRepository.findOne({
        where: { id },
      });
      if (!location) {
        return response.status(400).json('job not found');
      }
      location.latitude = request.body.latitude;
      location.longitude = request.body.longitude;
      const res = await this.locationRepository.save(location);
      response.status(201).json({
        status: true,
        message: 'password changed successfully',
        data: res,
      });
      return;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async removeLocation(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;
      const location = await this.locationRepository.findOne({
        where: { id },
      });

      if (!location) {
        return response.status(400).send('location not found');
      }
      await this.locationRepository.remove(location);
      response.status(201).send('location deleted successfully');
      return;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }
}
