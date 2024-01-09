
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ResponseMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}

export function responseMiddleware (req: Request, res: Response, next: NextFunction) {
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('robots', 'noindex');
  res.setHeader('Disallow', '/');
  next();
};