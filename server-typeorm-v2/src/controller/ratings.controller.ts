import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Rating } from '../entity/Ratings.entity';

export class RatingController {
  private ratingRepository = AppDataSource.getRepository(Rating);

  async allRatings(_: Request, response: Response) {
    try {
      const users = await this.ratingRepository.find();
      response.status(201).json({
        status: true,
        message: `user successfully fetched`,
        data: users,
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

  async oneRating(request: Request, response: Response) {
    try {
      const address = await this.ratingRepository.findOne({
        where: {
          id: request.params.id,
        },
      });

      if (!address) {
        return 'unregistered address';
      }
      return address;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async saveRating(request: Request, response: Response) {
    try {
      const rating = Object.assign(new Rating(), {
        ...request.body,
      });
      const savedRating = await this.ratingRepository.save({
        ...rating,
      });

      response.status(201).json({
        status: true,
        message: `Rating created successfully`,
        data: savedRating,
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

  async updateRating(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const rating = await this.ratingRepository.findOne({
        where: { id },
      });
      if (!rating) {
        return response.status(400).json('rating not found');
      }
      rating.ratings = request.body.ratings;
      rating.review_text = request.body.review_text;

      const res = await this.ratingRepository.save(rating);
      response.status(201).json({
        status: true,
        message: 'rating changed successfully',
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

  async removeRatings(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;
      const ratingToRemove = await this.ratingRepository.findOneBy({
        id,
      });

      if (!ratingToRemove) {
        return 'this rating not exist';
      }

      await this.ratingRepository.remove(ratingToRemove);

      response.status(201).send('rating deleted successfully');
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
