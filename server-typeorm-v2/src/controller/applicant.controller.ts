import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Applicant } from '../entity/Applicants.entity';
import { User } from '../entity/User.entity';

export class ApplicantController {
  private applicantRepository = AppDataSource.getRepository(Applicant);
  private userRepository = AppDataSource.getRepository(User);

  async allApplicants(_: Request, response: Response) {
    try {
      const applicants = this.applicantRepository.find();
      response.status(201).json({
        status: true,
        message: `applicant successfully fetched`,
        data: applicants,
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
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async saveApplicant(request: Request, response: Response) {
    try {
      const applicant = Object.assign(new Applicant(), {
        username: request.body.username,
        isActive: true,
      });
      const savedApplicant = await this.applicantRepository.save(applicant);
      const user = Object.assign(new Applicant(), {
        ...request.body,
      });
      await this.userRepository.save(user);
      response.status(201).json({
        status: true,
        message: `applicant successfully created click on the`,
        data: savedApplicant,
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

  async updateApplicant(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const { country } = request.body;

      const applicantToUpdate = await this.applicantRepository.findOneBy({
        id,
      });
      const userToUpdate = await this.userRepository.findOneBy({
        username: applicantToUpdate.username,
      });
      if (!applicantToUpdate || userToUpdate) {
        return 'this applicant not exist';
      }
      userToUpdate.country = country;
      const savedUser = await this.userRepository.save(userToUpdate);

      response.status(201).json({ status: 'user registered successfully' });
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

  async removeApplicant(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;

      const applicantToRemove = await this.applicantRepository.findOneBy({
        id,
      });
      const userToRemove = await this.userRepository.findOneBy({
        username: applicantToRemove.username,
      });

      if (!applicantToRemove || userToRemove) {
        return 'this applicant not exist';
      }

      await this.applicantRepository.remove(applicantToRemove);

      response.status(201).send('applicant deleted successfully');
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
