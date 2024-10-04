import AppDataSource from "../data-source";
import { NextFunction, Request, Response } from "express";
import { User } from "../entity/User";

export class VerifyEmailController {
  private userRepository = AppDataSource.getRepository(User);
}
