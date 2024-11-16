import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { FineGrainedSalary } from '../entity/FineGrained.entity';

export class FineGrainedController {
  private finegrainedRepository =
    AppDataSource.getRepository(FineGrainedSalary);

  async allFineGrained(_: Request, response: Response) {
    try {
      const FineGrainedSalary = await this.finegrainedRepository.find();
      response.status(201).json({
        status: true,
        message: `FineGrainedSalarys for this job post`,
        data: FineGrainedSalary,
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

  async oneFineGrained(request: Request, response: Response) {
    try {
      const id = request.params.id;
      const fineGrained = await this.finegrainedRepository.findOne({
        where: {
          id: id,
        },
      });
      response.status(201).json({
        status: true,
        message: `fineGrained found`,
        data: fineGrained,
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

  async saveFineGrained(request: Request, response: Response) {
    try {
      const savedFinedGrained = await this.finegrainedRepository.save({
        ...request.body,
      });
      response.status(201).json({
        status: true,
        message: `application created successfully`,
        data: savedFinedGrained,
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

  async updateFineGrained(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const fineGrained = await this.finegrainedRepository.findOne({
        where: { id },
      });
      if (!fineGrained) {
        return response.status(400).json('fine grained for salary not found');
      }
      fineGrained.fixedOvertimePay = request.body.fixedOvertimePay;
      fineGrained.fixedOvertimeSalaryMinor = request.body.cover_letter;
      fineGrained.statutoryOvertimeHours = request.body.statutoryOvertimeHours;
      fineGrained.totalSalaryMinor = request.body.totalSalaryMinor;

      const res = await this.finegrainedRepository.save(fineGrained);
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

  async removeFineGrained(
    request: Request<{ id: string }>,
    response: Response,
  ) {
    try {
      const id = request.params.id;
      const fineGrained = await this.finegrainedRepository.findOne({
        where: { id },
      });

      if (!fineGrained) {
        return response.status(400).send('fineGrained not found');
      }
      await this.finegrainedRepository.remove(fineGrained);
      response.status(201).send('address deleted successfully');
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
