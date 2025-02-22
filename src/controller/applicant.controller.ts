import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Applicant } from '../entity/Applicants.entity';

export class ApplicantController {
  private applicantRepository = AppDataSource.getRepository(Applicant);

  async allApplicants(_: Request, response: Response) {
    try {
      const applicants = await this.applicantRepository.find();
      response.status(201).json({
        status: true,
        message: `applicant successfully fetched`,
        data: applicants,
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

  async oneApplicant(request: Request, response: Response) {
    try {
      const id = request.params.id;

      const applicant = await this.applicantRepository.findOne({
        where: { id },
      });

      if (!applicant) {
        return 'unregistered applicant';
      }
      return applicant;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }
}
