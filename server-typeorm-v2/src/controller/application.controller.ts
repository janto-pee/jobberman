import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Application } from '../entity/Application.entity';
import { Job } from '../entity/Job.entity';
import { Salary } from '../entity/Salary.entity';
import { Applicant } from '../entity/Applicants.entity';

export class ApplicationController {
  private applicationRepository = AppDataSource.getRepository(Application);
  private jobRepository = AppDataSource.getRepository(Job);
  private applicantRepository = AppDataSource.getRepository(Applicant);

  async allApplication(_: Request, response: Response) {
    try {
      const application = await this.applicationRepository.find();
      response.status(201).json({
        status: true,
        message: `user applications for this job post`,
        data: application,
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

  async oneApplication(request: Request, response: Response) {
    try {
      const id = request.params.id;
      const application = await this.applicationRepository.findOne({
        where: {
          id: id,
        },
      });
      response.status(201).json({
        status: true,
        message: `user application for this job post`,
        data: application,
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

  async saveApplication(request: Request, response: Response) {
    try {
      const { jobId } = request.params;
      const job = await this.jobRepository.findOne({
        where: { id: jobId },
      });
      if (!job) {
        return response.status(400).json('job not found');
      }
      const { applicantId } = request.params;
      const applicant = await this.applicantRepository.findOne({
        where: { id: applicantId },
      });
      if (!applicant) {
        return response.status(400).json('applicant not found');
      }
      const application = Object.assign(new Application(), {
        ...request.body,
      });
      const savedApplication = await this.applicationRepository.save({
        ...application,
        job: job,
        applicant: applicant,
      });
      response.status(201).json({
        status: true,
        message: `application created successfully`,
        data: savedApplication,
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

  async updateApplication(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const application = await this.applicationRepository.findOne({
        where: { id },
      });
      if (!application) {
        return response.status(400).json('job not found');
      }
      application.application_text = request.body.application_text;
      application.cover_letter = request.body.cover_letter;
      application.referral_information = request.body.referral_information;
      application.resume = request.body.resume;
      const res = await this.applicationRepository.save(application);
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

  async removeApplication(
    request: Request<{ id: string }>,
    response: Response,
  ) {
    try {
      const id = request.params.id;
      const application = await this.applicationRepository.findOne({
        where: { id },
      });

      if (!application) {
        return response.status(400).send('application not found');
      }
      await this.applicationRepository.remove(application);
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
