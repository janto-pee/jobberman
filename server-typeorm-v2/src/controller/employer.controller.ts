import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Employer } from '../entity/Employer.entity';
import { Company } from '../entity/Company.entity';

export class EmployeerController {
  private EmployerRepository = AppDataSource.getRepository(Employer);
  private CompanyRepository = AppDataSource.getRepository(Company);

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

  async saveEmployerCompany(request: Request, response: Response) {
    try {
      const company = await this.CompanyRepository.findOne({
        where: { id: request.params.company },
      });
      const employer = await this.EmployerRepository.findOne({
        where: { id: request.params.employer },
      });

      if (!company) {
        return response
          .status(400)
          .send(
            'user with username does not exist, do you have an account with username?',
          );
      }
      company.employer = [employer];

      await this.EmployerRepository.save(employer);

      response.status(201).json({
        status: true,
        message: `address updated successfully`,
        data: company,
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
}
