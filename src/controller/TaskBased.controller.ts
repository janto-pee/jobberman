import AppDataSource from '../../data-source';
import { Request, Response } from 'express';
import { TaskBased } from '../entity/TaskBased.entity';

export class TaskBasedController {
  private taskgrainedRepository = AppDataSource.getRepository(TaskBased);

  async allTaskBased(_: Request, response: Response) {
    try {
      const users = await this.taskgrainedRepository.find();
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

  async oneTaskBased(request: Request, response: Response) {
    try {
      const task = await this.taskgrainedRepository.findOne({
        where: {
          id: request.params.id,
        },
      });

      if (!task) {
        return 'unregistered task';
      }
      return task;
    } catch (error) {
      response.status(500).json({
        status: false,
        message: 'server error',
        error: error,
      });
    }
  }

  async saveTaskBased(request: Request, response: Response) {
    try {
      const task = Object.assign(new TaskBased(), {
        ...request.body,
      });
      const savedtask = await this.taskgrainedRepository.save({
        ...task,
      });

      response.status(201).json({
        status: true,
        message: `Task based salary updated successfully`,
        data: savedtask,
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

  async updateTaskBased(request: Request, response: Response) {
    try {
      const { id } = request.params;
      const TBS = await this.taskgrainedRepository.findOne({
        where: {
          id,
        },
      });

      if (!TBS) {
        return 'TBS not found';
      }
      TBS.updatedAt = request.body.updatedAt;
      const res = await this.taskgrainedRepository.save(TBS);
      response.status(201).json({
        status: true,
        message: 'TBS updated successfully',
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

  async removeTaskBased(request: Request<{ id: string }>, response: Response) {
    try {
      const id = request.params.id;
      const TBS = await this.taskgrainedRepository.findOneBy({
        id,
      });

      if (!TBS) {
        return 'task based salary does not exist';
      }

      await this.taskgrainedRepository.remove(TBS);

      response.status(201).send('task based salary deleted successfully');
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
