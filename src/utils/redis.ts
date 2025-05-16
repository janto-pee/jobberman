import { createClient } from "redis";
import { logger } from "./logger";

// Redis client options
const redisOptions = {
  url: process.env.REDIS_URL || "redis://localhost:6379",
  socket: {
    reconnectStrategy: (retries: number) => {
      // Exponential backoff with max delay of 10 seconds
      const delay = Math.min(Math.pow(2, retries) * 100, 10000);
      logger.info(`Redis reconnecting in ${delay}ms...`);
      return delay;
    },
  },
};

// Create Redis client
export const redisClient = createClient(redisOptions);

// Handle Redis events
redisClient.on("connect", () => {
  logger.info("Redis client connected");
});

redisClient.on("error", (err) => {
  logger.error(`Redis client error: ${err}`);
});

redisClient.on("reconnecting", () => {
  logger.warn("Redis client reconnecting");
});

// Initialize Redis connection
export const initRedis = async () => {
  try {
    await redisClient.connect();
  } catch (error) {
    logger.error(`Failed to connect to Redis: ${error}`);
    throw error;
  }
};

// Cache helper functions
export const getCache = async <T>(key: string): Promise<T | null> => {
  try {
    const data = await redisClient.get(key);
    if (!data) return null;
    return JSON.parse(data) as T;
  } catch (error) {
    logger.error(`Redis get error for key ${key}: ${error}`);
    return null;
  }
};

export const setCache = async <T>(
  key: string,
  value: T,
  expiryInSeconds: number = 3600
): Promise<void> => {
  try {
    await redisClient.set(key, JSON.stringify(value), {
      EX: expiryInSeconds,
    });
    return;
  } catch (error) {
    logger.error(`Redis set error for key ${key}: ${error}`);
  }
};

export const deleteCache = async (key: string): Promise<void> => {
  try {
    await redisClient.del(key);
  } catch (error) {
    logger.error(`Redis delete error for key ${key}: ${error}`);
  }
};

export const invalidatePattern = async (pattern: string): Promise<void> => {
  try {
    let cursor = 0;
    do {
      const result = await redisClient.scan(cursor, {
        MATCH: pattern,
        COUNT: 100,
      });

      cursor = result.cursor;

      if (result.keys.length) {
        await redisClient.del(result.keys);
      }
    } while (cursor !== 0);
  } catch (error) {
    logger.error(`Redis pattern invalidation error for ${pattern}: ${error}`);
  }
};
