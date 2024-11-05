import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Salary } from '../entity/Salary.entity';

export class SalaryController {
  private salaryRepository = AppDataSource.getRepository(Salary);

  async allSalary(_: Request, response: Response) {
    try {
      const salarys = this.salaryRepository.find();
      response.status(201).json({
        status: true,
        message: `salary successfully fetched`,
        data: salarys,
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

  async oneSalary(request: Request, response: Response) {
    try {
      const id = request.params.id;

      const salary = await this.salaryRepository.findOne({
        where: { id },
      });

      if (!salary) {
        return 'unregistered salary';
      }
      return salary;
    } catch (error) {
      console.log(error);
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

      const savedSalary = await this.salaryRepository.save(salary);
      response.status(201).json({
        status: true,
        message: `salary successfully created click on the`,
        data: savedSalary,
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

  async removeSalary(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;

      const salaryToRemove = await this.salaryRepository.findOneBy({
        id,
      });

      if (!salaryToRemove) {
        return 'this salary not exist';
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
