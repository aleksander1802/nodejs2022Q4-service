import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;

    if (!token) {
      throw new UnauthorizedException('Missing or invalid token');
    }

    const tokenWithoutBearer = token.replace('Bearer ', '');

    try {
      const decodedToken = await this.jwtService.verify(tokenWithoutBearer);
      req['user'] = decodedToken;
    } catch (error) {
      throw new UnauthorizedException('Invalid token');
    }

    next();
  }
}
