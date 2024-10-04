import AppDataSource from "../data-source";
import { NextFunction, Request, Response } from "express";
import { Message } from "../entity/Messages";

export class MessageController {
  private messageRepository = AppDataSource.getRepository(Message);

  async allMessages(request: Request, response: Response, next: NextFunction) {
    return this.messageRepository.find();
  }

  async oneMessage(request: Request, response: Response, next: NextFunction) {
    const id = request.params.id;

    const user = await this.messageRepository.findOne({
      where: { id },
    });

    if (!user) {
      return "unregistered user";
    }
    return user;
  }

  async saveMessage(request: Request, response: Response, next: NextFunction) {
    const { sender_username, reciever_username, content } = request.body;

    const user = Object.assign(new Message(), {
      sender_username,
      reciever_username,
      content,
    });

    return this.messageRepository.save(user);
  }

  async updateMessage(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const { sender_username, reciever_username, content } = request.body;
    const id = request.params.id;
    let messageToUpdate = await this.messageRepository.findOneBy({ id });
    if (!messageToUpdate) {
      return "this user does not exist";
    }

    const user = Object.assign(new Message(), {
      sender_username,
      reciever_username,
      content,
    });

    return this.messageRepository.save(user);
  }

  async removeMessage(
    request: Request,
    response: Response,
    next: NextFunction
  ) {
    const id = request.params.id;

    let messageToRemove = await this.messageRepository.findOneBy({ id });

    if (!messageToRemove) {
      return "this message does not exist";
    }

    await this.messageRepository.remove(messageToRemove);

    return "message has been removed";
  }
}
