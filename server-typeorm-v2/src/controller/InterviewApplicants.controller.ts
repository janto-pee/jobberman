import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { InterviewApplicant } from '../entity/InterviewApplicants.entity';

export class InterviewApplicantController {
  private interviewApplicantRepository =
    AppDataSource.getRepository(InterviewApplicant);

  async allInterviewApplicants(_: Request, response: Response) {
    try {
      const interviewApplicant = await this.interviewApplicantRepository.find();
      response.status(201).json({
        status: true,
        message: `all applicants to be interviewed successfully fetched`,
        data: interviewApplicant,
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

  async oneInterviewApplicants(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const interviewApplicants =
        await this.interviewApplicantRepository.findOne({
          where: {
            id,
          },
        });

      if (!interviewApplicants) {
        return 'interviewed applicants not found';
      }
      return interviewApplicants;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async saveInterviewApplicants(request: Request, response: Response) {
    try {
      const address = Object.assign(new InterviewApplicant(), {
        ...request.body,
      });

      const savedInterviewApplicants =
        await this.interviewApplicantRepository.save({
          ...address,
        });

      response.status(201).json({
        status: true,
        message: `interview applicant createdsuccessfully`,
        data: savedInterviewApplicants,
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
}
