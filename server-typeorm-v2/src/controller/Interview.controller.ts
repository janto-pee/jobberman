import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Interview } from '../entity/Interview.entity';

export class InterviewController {
  private interviewRepository = AppDataSource.getRepository(Interview);

  async all(_: Request, response: Response) {
    try {
      const interviews = this.interviewRepository.find();
      response.status(201).json({
        status: true,
        message: `interview successfully fetched`,
        data: interviews,
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

      const interview = await this.interviewRepository.findOne({
        where: { id },
      });

      if (!interview) {
        return 'unregistered interview';
      }
      return interview;
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
      const interview = Object.assign(new Interview(), {
        ...request.body,
      });

      const savedInterview = await this.interviewRepository.save(interview);
      response.status(201).json({
        status: true,
        message: `interview successfully created click on the`,
        data: savedInterview,
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

      const interviewToRemove = await this.interviewRepository.findOneBy({
        id,
      });

      if (!interviewToRemove) {
        return 'this interview not exist';
      }

      await this.interviewRepository.remove(interviewToRemove);

      response.status(201).send('interview deleted successfully');
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
