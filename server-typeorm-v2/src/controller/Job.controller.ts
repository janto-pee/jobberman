import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Job } from '../entity/Job.entity';

export class JobController {
  private jobRepository = AppDataSource.getRepository(Job);

  async all(_: Request, response: Response) {
    try {
      const jobs = this.jobRepository.find();
      response.status(201).json({
        status: true,
        message: `job successfully fetched`,
        data: jobs,
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

      const job = await this.jobRepository.findOne({
        where: { id },
      });

      if (!job) {
        return 'unregistered job';
      }
      return job;
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
      const job = Object.assign(new Job(), {
        ...request.body,
      });

      const savedJob = await this.jobRepository.save(job);
      response.status(201).json({
        status: true,
        message: `job successfully created click on the`,
        data: savedJob,
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

      const jobToRemove = await this.jobRepository.findOneBy({
        id,
      });

      if (!jobToRemove) {
        return 'this job not exist';
      }

      await this.jobRepository.remove(jobToRemove);

      response.status(201).send('job deleted successfully');
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
