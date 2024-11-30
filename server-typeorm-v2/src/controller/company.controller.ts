import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
// import { Job } from '../entity/Job.entity';
// import { Applicant } from '../entity/Applicants.entity';
import { Company } from '../entity/Company.entity';

export class CompanyController {
  private companyRepository = AppDataSource.getRepository(Company);
  // private jobRepository = AppDataSource.getRepository(Job);
  // private applicantRepository = AppDataSource.getRepository(Applicant);

  async allCompany(_: Request, response: Response) {
    try {
      const application = await this.companyRepository.find();
      response.status(201).json({
        status: true,
        message: `all companies registered`,
        data: application,
      });
      return;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async oneCompany(request: Request, response: Response) {
    try {
      const id = request.params.id;
      const application = await this.companyRepository.findOne({
        where: {
          id: id,
        },
      });
      response.status(201).json({
        status: true,
        message: `company`,
        data: application,
      });
      return;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async saveCompany(request: Request, response: Response) {
    try {
      const company = Object.assign(new Company(), {
        ...request.body,
      });
      const savedCompany = await this.companyRepository.save({
        ...company,
      });
      response.status(201).json({
        status: true,
        message: `acompany created successfully`,
        data: savedCompany,
      });
      return;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async updateCompany(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const company = await this.companyRepository.findOne({
        where: { id },
      });
      if (!company) {
        return response.status(400).json('job not found');
      }
      company.company_name = request.body.company_name;
      company.about_us = request.body.about_us;
      const res = await this.companyRepository.save(company);
      response.status(201).json({
        status: true,
        message: 'company changed successfully',
        data: res,
      });
      return;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async removeCompany(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;
      const company = await this.companyRepository.findOne({
        where: { id },
      });

      if (!company) {
        return response.status(400).send('company not found');
      }
      await this.companyRepository.remove(company);
      response.status(201).send('company deleted successfully');
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
