import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { ApplicantRating } from '../entity/ApplicantRating.enitity';
import { Job } from '../entity/Job.entity';

export class ApplicantRatingController {
  private applicationRatingRepository =
    AppDataSource.getRepository(ApplicantRating);
  private jobRepository = AppDataSource.getRepository(Job);

  async allApplicationRating(_: Request, response: Response) {
    try {
      const applicationRating = await this.applicationRatingRepository.find();
      response.status(201).json({
        status: true,
        message: `all ratings for applications successfully fetched`,
        data: applicationRating,
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

  async oneApplicationRating(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const applicationRating = await this.applicationRatingRepository.findOne({
        where: {
          id,
        },
      });

      if (!applicationRating) {
        return 'ratings for job application not found';
      }
      return applicationRating;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async saveApplicationRating(request: Request, response: Response) {
    try {
      const { jobId } = request.params;
      const job = await this.jobRepository.findOne({
        where: { id: jobId },
      });
      if (!job) {
        response.status(400).json('job not found');
        return;
      }
      const rating = Object.assign(new ApplicantRating(), {
        ...request.body,
      });
      const savedApplicationRating =
        await this.applicationRatingRepository.save({
          ...rating,
          job: job,
        });

      response.status(201).json({
        status: true,
        message: `applicants rating updated successfully`,
        data: savedApplicationRating,
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
