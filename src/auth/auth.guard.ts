import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { JwtService } from '@nestjs/jwt';

import { Request } from 'express';
import { IS_PUBLIC_KEY } from './public.decorator';
import { UsersService } from 'src/users/users.service';
import { JwtPayload } from './jwt.inteface';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
    private userService: UsersService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      console.log('Inside AuthGuard: No token found.');
      throw new UnauthorizedException();
    }
    console.log('Inside AuthGuard: No token found.');
    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token, {
        secret: 'secret123123',
      });
      console.log('Inside AuthGuard: No token found.');
      const user = await this.userService.findOne(payload.userId);
      console.log('Inside AuthGuard: No token found.');
      if (user.login !== payload.login) {
        console.log('Inside AuthGuard: No token found.');
        throw new Error('Invalid token');
      }
    } catch {
      console.log('Inside AuthGuard: No token found.');
      throw new UnauthorizedException();
    }
    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
