import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Probation } from '../entity/Probation.entity';

export class ProbationController {
  private probationRepository = AppDataSource.getRepository(Probation);

  async allProbation(_: Request, response: Response) {
    try {
      const probations = this.probationRepository.find();
      response.status(201).json({
        status: true,
        message: `probation successfully fetched`,
        data: probations,
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

  async oneProbation(request: Request, response: Response) {
    try {
      const id = request.params.id;

      const probation = await this.probationRepository.findOne({
        where: { id },
      });

      if (!probation) {
        return 'unregistered probation';
      }
      return probation;
    } catch (error) {
      console.log(error);
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

      const savedProbation = await this.probationRepository.save(probation);
      response.status(201).json({
        status: true,
        message: `probation successfully created click on the`,
        data: savedProbation,
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

  async removeProbation(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;

      const probationToRemove = await this.probationRepository.findOneBy({
        id,
      });

      if (!probationToRemove) {
        return 'this probation not exist';
      }

      await this.probationRepository.remove(probationToRemove);

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
