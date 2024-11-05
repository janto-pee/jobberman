import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Rating } from '../entity/Ratings.entity';

export class RatingController {
  private ratingRepository = AppDataSource.getRepository(Rating);

  async allRatings(_: Request, response: Response) {
    try {
      const ratings = this.ratingRepository.find();
      response.status(201).json({
        status: true,
        message: `rating successfully fetched`,
        data: ratings,
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
      const id = request.params.id;

      const rating = await this.ratingRepository.findOne({
        where: { id },
      });

      if (!rating) {
        return 'unregistered rating';
      }
      return rating;
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

      const savedRating = await this.ratingRepository.save(rating);
      response.status(201).json({
        status: true,
        message: `rating successfully created click on the`,
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

  async removeRating(request: Request<{ id: string }>, response: Response) {
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
