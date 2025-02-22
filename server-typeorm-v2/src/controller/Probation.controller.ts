import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Probation } from '../entity/Probation.entity';

export class ProbationController {
  private probationRepository = AppDataSource.getRepository(Probation);

  async allProbations(_: Request, response: Response) {
    try {
      const users = await this.probationRepository.find();
      response.status(201).json({
        status: true,
        message: `user successfully fetched`,
        data: users,
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

  async oneProbation(request: Request, response: Response) {
    try {
      const address = await this.probationRepository.findOne({
        where: {
          id: request.params.id,
        },
      });

      if (!address) {
        return 'unregistered address';
      }
      return address;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async saveProbation(request: Request, response: Response) {
    try {
      const probation = Object.assign(new Probation(), {
        ...request.body,
      });

      const savedProbation = await this.probationRepository.save({
        ...probation,
      });

      response.status(201).json({
        status: true,
        message: `probation updated successfully`,
        data: savedProbation,
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

  async updateProbation(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const probation = await this.probationRepository.findOne({
        where: {
          id,
        },
      });

      if (!probation) {
        return 'probation does not exist';
      }
      probation.status = request.body.status;
      const res = await this.probationRepository.save(probation);
      response.status(201).json({
        status: true,
        message: 'probation updated successfully',
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

  async removeProbation(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;
      const probation = await this.probationRepository.findOne({
        where: { id },
      });
      if (!probation) {
        response.status(400).send('probation not found');
        return;
      }

      await this.probationRepository.remove(probation);

      response.status(201).send('probation deleted successfully');
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
