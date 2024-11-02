import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Employer } from '../entity/Employer.entity';

export class EmployerController {
  private employerRepository = AppDataSource.getRepository(Employer);

  async allEmployers(_: Request, response: Response) {
    try {
      const employers = this.employerRepository.find();
      response.status(201).json({
        status: true,
        message: `employer successfully fetched`,
        data: employers,
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

  async oneEmployer(request: Request, response: Response) {
    try {
      const id = request.params.id;

      const employer = await this.employerRepository.findOne({
        where: { id },
      });

      if (!employer) {
        return 'unregistered employer';
      }
      return employer;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async saveEmployer(request: Request, response: Response) {
    try {
      const employer = Object.assign(new Employer(), {
        ...request.body,
      });

      const savedEmployer = await this.employerRepository.save(employer);
      response.status(201).json({
        status: true,
        message: `employer successfully created click on the`,
        data: savedEmployer,
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

  async removeEmployer(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;

      const employerToRemove = await this.employerRepository.findOneBy({
        id,
      });

      if (!employerToRemove) {
        return 'this employer not exist';
      }

      await this.employerRepository.remove(employerToRemove);

      response.status(201).send('employer deleted successfully');
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
