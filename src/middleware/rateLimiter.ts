import rateLimit from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";
import { redisClient } from "../utils/redis";
import { logger } from "../utils/logger";

/**
 * Create a rate limiter middleware
 * @param options Rate limiter options
 */
export const createRateLimiter = (options: {
  windowMs?: number;
  max?: number;
  standardHeaders?: boolean;
  legacyHeaders?: boolean;
  keyPrefix?: string;
  message?: string;
}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // Limit each IP to 100 requests per windowMs
    standardHeaders = true,
    legacyHeaders = false,
    keyPrefix = "ratelimit:",
    message = "Too many requests, please try again later.",
  } = options;

  return rateLimit({
    windowMs,
    max,
    standardHeaders,
    legacyHeaders,
    message: { status: false, message },
    // keyGenerator: (req) => req.ip,
    store: new RedisStore({
      sendCommand: (...args: string[]) => redisClient.sendCommand(args),
      prefix: keyPrefix,
    }),
    skip: (req) => {
      // Skip rate limiting for health check endpoint
      return req.path === "/health";
    },
    handler: (req, res, next, options) => {
      logger.warn(`Rate limit exceeded for IP: ${req.ip}`);
      res.status(429).json({
        status: false,
        message: options.message,
      });
    },
  });
};

// Default rate limiter for general API endpoints
export const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 minutes
  keyPrefix: "ratelimit:api:",
});

// Stricter rate limiter for authentication endpoints
export const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 requests per 15 minutes
  keyPrefix: "ratelimit:auth:",
  message: "Too many authentication attempts, please try again later.",
});
