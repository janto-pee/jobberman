import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Log the request
  logger.http(
    `${req.method} ${req.url} ${JSON.stringify({
      ip: req.ip,
      params: req.params,
      query: req.query,
      body: req.method !== "GET" ? req.body : undefined,
      user: res.locals.user?.id,
    })}`
  );

  // Log the response
  const originalSend = res.send;
  res.send = function (body) {
    logger.http(
      `RESPONSE ${req.method} ${req.url} ${res.statusCode} ${
        typeof body === "object" ? JSON.stringify(body).substring(0, 200) : body
      }`
    );
    return originalSend.call(this, body);
  };

  next();
};
