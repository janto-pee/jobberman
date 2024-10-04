import AppDataSource from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Job } from "../entity/Jobs";

export class JobController {
  private jobRepository = AppDataSource.getRepository(Job);

  async allJobs(request: Request, response: Response, next: NextFunction) {
    return this.jobRepository.find();
  }

  async oneJob(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;

    const job = await this.jobRepository.findOne({
      where: { id },
    });

    if (!job) {
      return "job not found";
    }
    return job;
  }

  async saveJob(request: Request, response: Response, next: NextFunction) {
    const {
      employer_id,
      title,
      description,
      qualification,
      complimentary_qualification,
      job_type,
      visa_sponsorship,
      remote_posible,
      preferred_timezones,
      location,
      salary,
      date_posted,
      relocation,
      skills,
      employer_hiring_contact,
    } = request.body;

    const user = Object.assign(new Job(), {
      employer_id,
      title,
      description,
      qualification,
      complimentary_qualification,
      job_type,
      visa_sponsorship,
      remote_posible,
      preferred_timezones,
      location,
      salary,
      date_posted,
      relocation,
      skills,
      employer_hiring_contact,
    });

    return this.jobRepository.save(user);
  }

  async updateJob(request: Request, response: Response, next: NextFunction) {
    const {
      employer_id,
      title,
      description,
      qualification,
      complimentary_qualification,
      job_type,
      visa_sponsorship,
      remote_posible,
      preferred_timezones,
      location,
      salary,
      date_posted,
      relocation,
      skills,
      employer_hiring_contact,
    } = request.body;
    const id = request.params.id;
    let jobToUpdate = await this.jobRepository.findOneBy({ id });
    if (!jobToUpdate) {
      return "this job does not exist";
    }

    const user = Object.assign(new Job(), {
      employer_id,
      title,
      description,
      qualification,
      complimentary_qualification,
      job_type,
      visa_sponsorship,
      remote_posible,
      preferred_timezones,
      location,
      salary,
      date_posted,
      relocation,
      skills,
      employer_hiring_contact,
    });

    return this.jobRepository.save(user);
  }

  async removeJob(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;

    let jobToRemove = await this.jobRepository.findOneBy({ id });

    if (!jobToRemove) {
      return "this user does not exist";
    }

    await this.jobRepository.remove(jobToRemove);

    return "user has been removed";
  }
}
