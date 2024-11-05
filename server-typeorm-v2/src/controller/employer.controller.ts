import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Employer } from '../entity/Employer.entity';

export class EmployeerController {
  private EmployerRepository = AppDataSource.getRepository(Employer);

  async allEmployers(_: Request, response: Response) {
    try {
      const Employers = await this.EmployerRepository.find();
      response.status(201).json({
        status: true,
        message: `Employer successfully fetched`,
        data: Employers,
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

      const Employer = await this.EmployerRepository.findOne({
        where: { id },
      });

      if (!Employer) {
        return 'unregistered Employer';
      }
      return Employer;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }
}
