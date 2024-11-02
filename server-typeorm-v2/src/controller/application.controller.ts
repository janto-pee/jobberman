import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Application } from '../entity/Application.entity';

export class ApplicationController {
  private applicationRepository = AppDataSource.getRepository(Application);

  async all(_: Request, response: Response) {
    try {
      const applications = this.applicationRepository.find();
      response.status(201).json({
        status: true,
        message: `application successfully fetched`,
        data: applications,
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

  async one(request: Request, response: Response) {
    try {
      const id = request.params.id;

      const application = await this.applicationRepository.findOne({
        where: { id },
      });

      if (!application) {
        return 'unregistered application';
      }
      return application;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async save(request: Request, response: Response) {
    try {
      const application = Object.assign(new Application(), {
        ...request.body,
      });

      const savedApplication =
        await this.applicationRepository.save(application);
      response.status(201).json({
        status: true,
        message: `application successfully created click on the`,
        data: savedApplication,
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

  async remove(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;

      const applicationToRemove = await this.applicationRepository.findOneBy({
        id,
      });

      if (!applicationToRemove) {
        return 'this application not exist';
      }

      await this.applicationRepository.remove(applicationToRemove);

      response.status(201).send('application deleted successfully');
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
