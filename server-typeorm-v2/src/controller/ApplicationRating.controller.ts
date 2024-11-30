import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { ApplicantRating } from '../entity/ApplicantRating.enitity';

export class ApplicantRatingController {
  private applicationRatingRepository =
    AppDataSource.getRepository(ApplicantRating);

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
      const address = Object.assign(new ApplicantRating(), {
        ...request.body,
      });
      const savedApplicationRating =
        await this.applicationRatingRepository.save({
          ...address,
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
