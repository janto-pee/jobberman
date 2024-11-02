import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { Message } from '../entity/Messages.entity';

export class MessageController {
  private messageRepository = AppDataSource.getRepository(Message);

  async all(_: Request, response: Response) {
    try {
      const messages = this.messageRepository.find();
      response.status(201).json({
        status: true,
        message: `message successfully fetched`,
        data: messages,
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

      const message = await this.messageRepository.findOne({
        where: { id },
      });

      if (!message) {
        return 'unregistered message';
      }
      return message;
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
      const message = Object.assign(new Message(), {
        ...request.body,
      });

      const savedMessage = await this.messageRepository.save(message);
      response.status(201).json({
        status: true,
        message: `message successfully created click on the`,
        data: savedMessage,
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

      const messageToRemove = await this.messageRepository.findOneBy({
        id,
      });

      if (!messageToRemove) {
        return 'this message not exist';
      }

      await this.messageRepository.remove(messageToRemove);

      response.status(201).send('message deleted successfully');
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
