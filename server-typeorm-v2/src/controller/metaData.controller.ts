import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Metadata } from '../entity/Metadata.entity';

export class ApplicationController {
  private metadataRepository = AppDataSource.getRepository(Metadata);

  async all(_: Request, response: Response) {
    try {
      const metadatas = this.metadataRepository.find();
      response.status(201).json({
        status: true,
        message: `metadata successfully fetched`,
        data: metadatas,
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

  async one(request: Request, response: Response) {
    try {
      const id = request.params.id;

      const metadata = await this.metadataRepository.findOne({
        where: { id },
      });

      if (!metadata) {
        return 'unregistered metadata';
      }
      return metadata;
    } catch (error) {
      console.log(error);
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async save(request: Request, response: Response) {
    try {
      const metadata = Object.assign(new Metadata(), {
        ...request.body,
      });

      const savedMetaData = await this.metadataRepository.save(metadata);
      response.status(201).json({
        status: true,
        message: `metadata successfully created click on the`,
        data: savedMetaData,
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

  async remove(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;

      const metadataToRemove = await this.metadataRepository.findOneBy({
        id,
      });

      if (!metadataToRemove) {
        return 'this metadata not exist';
      }

      await this.metadataRepository.remove(metadataToRemove);

      response.status(201).send('metadata deleted successfully');
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
