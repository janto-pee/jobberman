import { AppDataSource } from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Rating } from "../entity/Rating";

export class RatingController {
  private RatingRepository = AppDataSource.getRepository(Rating);

  async allRatings(request: Request, response: Response, next: NextFunction) {
    return this.RatingRepository.find();
  }

  async oneRating(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;

    const rating = await this.RatingRepository.findOne({
      where: { id },
    });

    if (!rating) {
      return "unregistered rating";
    }
    return rating;
  }

  async saveRating(request: Request, response: Response, next: NextFunction) {
    const { reviewer, job_id, application_id, ratings, review_text } =
      request.body;

    const rating = Object.assign(new Rating(), {
      reviewer,
      job_id,
      application_id,
      ratings,
      review_text,
    });

    return this.RatingRepository.save(rating);
  }

  async updateRating(request: Request, response: Response, next: NextFunction) {
    const { reviewer, job_id, application_id, ratings, review_text } =
      request.body;
    const id = request.params.id;
    let RatingToUpdate = await this.RatingRepository.findOneBy({ id });
    if (!RatingToUpdate) {
      return "this rating does not exist";
    }

    const rating = Object.assign(new Rating(), {
      reviewer,
      job_id,
      application_id,
      ratings,
      review_text,
    });

    return this.RatingRepository.save(rating);
  }

  async removeRating(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;

    let RatingToRemove = await this.RatingRepository.findOneBy({ id });

    if (!RatingToRemove) {
      return "this Rating does not exist";
    }

    await this.RatingRepository.remove(RatingToRemove);

    return "message has been removed";
  }
}
