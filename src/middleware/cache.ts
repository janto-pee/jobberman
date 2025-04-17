import { Request, Response, NextFunction } from 'express';
import { getCache, setCache } from '../utils/redis';
import { logger } from '../utils/logger';

interface CacheOptions {
  ttl?: number;
  keyPrefix?: string;
}

/**
 * Middleware to cache API responses
 * @param options Cache options
 */
export const cacheMiddleware = (options: CacheOptions = {}) => {
  const { ttl = 3600, keyPrefix = 'api:cache:' } = options;
  
  return async (req: Request, res: Response, next: NextFunction) => {
    // Skip caching for non-GET requests
    if (req.method !== 'GET') {
      return next();
    }
    
    // Skip caching for authenticated requests
    if (res.locals.user) {
      return next();
    }
    
    // Generate cache key based on URL and query parameters
    const cacheKey = `${keyPrefix}${req.originalUrl}`;
    
    try {
      // Try to get data from cache
      const cachedData = await getCache<any>(cacheKey);
      
      if (cachedData) {
        logger.debug(`Cache hit for ${cacheKey}`);
        return res.status(200).json(cachedData);
      }
      
      // Cache miss, capture the response
      const originalSend = res.send;
      
      res.send = function(body): Response {
        // Only cache successful responses
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            const data = JSON.parse(body);
            setCache(cacheKey, data, ttl)
              .catch(err => logger.error(`Failed to set cache: ${err}`));
          } catch (error) {
            logger.error(`Failed to parse response for caching: ${error}`);
          }
        }
        
        return originalSend.call(this, body);
      };
      
      next();
    } catch (error) {
      logger.error(`Cache middleware error: ${error}`);
      next();
    }
  };
};

/**
 * Middleware to cache specific routes with custom TTL
 * @param ttl Time to live in seconds
 */
export const cache = (ttl: number) => cacheMiddleware({ ttl });
