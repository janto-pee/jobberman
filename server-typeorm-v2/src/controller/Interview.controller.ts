import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Interview } from '../entity/Interview.entity';
import { Employer } from '../entity/Employer.entity';
import { Applicant } from '../entity/Applicants.entity';
import { Application } from '../entity/Application.entity';

export class InterviewController {
  private interviewRepository = AppDataSource.getRepository(Interview);
  private employerRepository = AppDataSource.getRepository(Employer);
  private applicantRepository = AppDataSource.getRepository(Applicant);
  private applicationRepository = AppDataSource.getRepository(Application);

  async allInterviews(_: Request, response: Response) {
    try {
      const interviews = await this.interviewRepository.find();
      response.status(201).json({
        status: true,
        message: `user interviews for this job post`,
        data: interviews,
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

  async oneInterview(request: Request, response: Response) {
    try {
      const id = request.params.id;
      const interview = await this.interviewRepository.findOne({
        where: {
          id: id,
        },
      });
      response.status(201).json({
        status: true,
        message: `interview found`,
        data: interview,
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

  async saveInterview(request: Request, response: Response) {
    try {
      const employer = await this.employerRepository.findOne({
        where: { id: request.params.employerId },
      });

      const applicant = await this.applicantRepository.findOne({
        where: { id: request.params.applicantId },
      });

      const application = await this.applicationRepository.findOne({
        where: {
          id: request.params.applicationId,
        },
        relations: {
          applicant: true,
        },
      });
      console.log('save interview', employer, applicant, application);

      if (
        !employer ||
        !applicant ||
        applicant.id !== application.applicant.id
      ) {
        response.status(500).json({
          status: 'error',
          message: `applicant or interviewer does not exist, please check the applicant id or interviewer id?`,
        });
        return;
      }
      const savedInterview = await this.interviewRepository.save({
        ...request.body,
        applicant: applicant,
        employer: employer,
      });
      response.status(201).json({
        status: true,
        message: `application created successfully`,
        data: savedInterview,
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

  async updateInterview(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const interview = await this.interviewRepository.findOne({
        where: { id },
      });
      if (!interview) {
        response.status(400).json('interview not found');
        return;
      }
      interview.startTime = request.body.startTime;
      interview.timezone = request.body.timezone;
      interview.endTime = request.body.endTime;
      interview.title = request.body.title;
      const res = await this.interviewRepository.save(interview);
      response.status(201).json({
        status: true,
        message: 'interview data changed successfully',
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

  async removeInterview(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;
      const interview = await this.interviewRepository.findOne({
        where: { id },
      });

      if (!interview) {
        response.status(400).send('interview not found');
        return;
      }
      await this.interviewRepository.remove(interview);
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
