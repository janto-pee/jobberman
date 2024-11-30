import { NextFunction, Request, Response } from 'express';

const requireUser = (_: Request, res: Response, next: NextFunction) => {
  const user = null;
  console.log('inside require user', user);
  if (!user) {
    res.status(400).send('user not authorized');
    return;
  }
  return next();
};
export default requireUser;
