import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { FineGrainedSalary } from '../entity/FineGrained.entity';

export class FineGrainedController {
  private finegrainedRepository =
    AppDataSource.getRepository(FineGrainedSalary);

  async allFineGraineds(_: Request, response: Response) {
    try {
      const finegraineds = this.finegrainedRepository.find();
      response.status(201).json({
        status: true,
        message: `finegrained successfully fetched`,
        data: finegraineds,
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

  async oneFineGrained(request: Request, response: Response) {
    try {
      const id = request.params.id;

      const finegrained = await this.finegrainedRepository.findOne({
        where: { id },
      });

      if (!finegrained) {
        return 'unregistered finegrained';
      }
      return finegrained;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async saveFineGrained(request: Request, response: Response) {
    try {
      const finegrained = Object.assign(new FineGrainedSalary(), {
        ...request.body,
      });

      const savedFinegrained =
        await this.finegrainedRepository.save(finegrained);
      response.status(201).json({
        status: true,
        message: `finegrained successfully created click on the`,
        data: savedFinegrained,
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

  async removeFineGrained(
    request: Request<{ id: string }>,
    response: Response,
  ) {
    try {
      const id = request.params.id;

      const finegrainedToRemove = await this.finegrainedRepository.findOneBy({
        id,
      });

      if (!finegrainedToRemove) {
        return 'this finegrained not exist';
      }

      await this.finegrainedRepository.remove(finegrainedToRemove);

      response.status(201).send('finegrained deleted successfully');
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
