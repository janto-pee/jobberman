import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Job } from '../entity/Job.entity';
import { Salary } from '../entity/Salary.entity';
import { Employer } from '../entity/Employer.entity';
import { Probation } from '../entity/Probation.entity';

export class JobController {
  private jobRepository = AppDataSource.getRepository(Job);
  private employerRepository = AppDataSource.getRepository(Employer);
  private probationRepository = AppDataSource.getRepository(Probation);

  async allJobs(_: Request, response: Response) {
    try {
      const jobs = await this.jobRepository.find();
      response.status(201).json({
        status: true,
        message: `jobs for this job post`,
        data: jobs,
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

  async oneJob(request: Request, response: Response) {
    try {
      const id = request.params.id;
      const job = await this.jobRepository.findOne({
        where: {
          id: id,
        },
      });
      response.status(201).json({
        status: true,
        message: `job found`,
        data: job,
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

  async saveJob(request: Request, response: Response) {
    try {
      const id = request.params.employerId;
      const employer = await this.employerRepository.findOne({
        where: {
          id: id,
        },
      });
      if (!employer) {
        return response.status(400).json('employer not found');
      }
      const job = Object.assign(new Job(), {
        ...request.body,
      });
      const salary = Object.assign(new Salary(), {
        currency: request.body.currency,
        maximumMinor: request.body.maximumMinor,
        minimumMinor: request.body.minimumMinor,
        period: request.body.period,
      });
      const probation = Object.assign(new Probation(), {
        ...request.body,
      });
      // const savedProbation = await this.probationRepository.save({
      //   ...probation,
      // });
      const savedJob = await this.jobRepository.save({
        ...job,
        salary: salary,
        probation: probation,
      });
      response.status(201).json({
        status: true,
        message: `job created successfully`,
        data: savedJob,
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

  async updateJob(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const job = await this.jobRepository.findOne({
        where: { id },
      });
      if (!job) {
        return response.status(400).json('job not found');
      }
      job.complimentary_qualification =
        request.body.complimentary_qualification;
      job.description = request.body.description;
      job.employer_hiring_contact = request.body.employer_hiring_contact;
      job.relocation = request.body.relocation;
      job.qualification = request.body.qualification;
      const res = await this.jobRepository.save(job);
      response.status(201).json({
        status: true,
        message: 'job updated successfully',
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

  async removeJob(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;
      const job = await this.jobRepository.findOne({
        where: { id },
      });

      if (!job) {
        return response.status(400).send('job not found');
      }
      await this.jobRepository.remove(job);
      response.status(201).send('job post deleted successfully');
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
