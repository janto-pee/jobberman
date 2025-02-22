import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Salary } from '../entity/Salary.entity';

export class SalaryController {
  private salaryRepository = AppDataSource.getRepository(Salary);

  async allSalarys(_: Request, response: Response) {
    try {
      const users = await this.salaryRepository.find();
      response.status(201).json({
        status: true,
        message: `user successfully fetched`,
        data: users,
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

  async oneSalary(request: Request, response: Response) {
    try {
      const address = await this.salaryRepository.findOne({
        where: {
          id: request.params.id,
        },
      });

      if (!address) {
        return 'unregistered address';
      }
      return address;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async saveSalary(request: Request, response: Response) {
    try {
      const salary = Object.assign(new Salary(), {
        ...request.body,
      });
      const savedSalary = await this.salaryRepository.save({
        ...salary,
      });

      response.status(201).json({
        status: true,
        message: `salary updated successfully`,
        data: savedSalary,
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

  async updateSalary(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const salary = await this.salaryRepository.findOne({
        where: {
          id,
        },
      });

      if (!salary) {
        return 'salary does not exist';
      }
      salary.currency = request.body.currency;
      salary.maximumMinor = request.body.maximumMinor;
      salary.minimumMinor = request.body.minimumMinor;
      salary.period = request.body.period;
      const res = await this.salaryRepository.save(salary);
      response.status(201).json({
        status: true,
        message: 'salary updated successfully',
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

  async removeSalary(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;

      const salaryToRemove = await this.salaryRepository.findOneBy({
        id,
      });

      if (!salaryToRemove) {
        return 'this address not exist';
      }

      await this.salaryRepository.remove(salaryToRemove);

      response.status(201).send('salary deleted successfully');
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
