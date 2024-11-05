import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Location } from '../entity/Location.entity';

export class LocationController {
  private locationRepository = AppDataSource.getRepository(Location);

  async allLocations(_: Request, response: Response) {
    try {
      const locations = this.locationRepository.find();
      response.status(201).json({
        status: true,
        message: `location successfully fetched`,
        data: locations,
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
        where: { id },
      });

      if (!location) {
        return 'unregistered location';
      }
      return location;
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
      const location = Object.assign(new Location(), {
        ...request.body,
      });

      const savedLocation = await this.locationRepository.save(location);
      response.status(201).json({
        status: true,
        message: `location successfully created click on the`,
        data: savedLocation,
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

      const locationToRemove = await this.locationRepository.findOneBy({
        id,
      });

      if (!locationToRemove) {
        return 'this location not exist';
      }

      await this.locationRepository.remove(locationToRemove);

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
