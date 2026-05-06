import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ResponseTimeMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const start = Date.now();

    res.on('finish', () => {
      const elapsed = Date.now() - start;
      if (elapsed > 500) {
        console.warn(
          `⚠️  [${req.method}] ${req.originalUrl} - ${elapsed}ms (slow)`,
        );
      } else {
        console.log(
          `  ✓ [${req.method}] ${req.originalUrl} - ${elapsed}ms`,
        );
      }
    });

    next();
  }
}
