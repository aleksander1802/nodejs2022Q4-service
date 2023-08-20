import {
  ForbiddenException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt.inteface';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { LoggingService } from 'src/logger/logging.service';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly loggingService: LoggingService,
  ) {}

  async signUp(signupDto: SignupDto) {
    try {
      return await this.usersService.create(signupDto);
    } catch (error) {
      this.loggingService.error({
        message: 'Error while signing up',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorResponse: error.message,
      });
      throw new InternalServerErrorException('Error while signing up');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const user = await this.usersService.findOneByLogin(loginDto.login);

      if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload: JwtPayload = { userId: user.id, login: user.login };
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_KEY,
      });
      const refreshToken = this.jwtService.sign(payload, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      return { accessToken, refreshToken };
    } catch (error) {
      this.loggingService.error({
        message: 'Error while logging in',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorResponse: error.message,
      });
      throw new InternalServerErrorException('Error while logging in');
    }
  }

  async refreshTokens(refreshToken: string) {
    try {
      const decoded = await this.jwtService.verify(refreshToken);

      const user = await this.usersService.findOne(decoded.userId);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const payload: JwtPayload = { userId: user.id, login: user.login };
      const accessToken = this.jwtService.sign(payload, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_KEY,
      });
      const newRefreshToken = this.jwtService.sign(payload, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        throw new ForbiddenException('Refresh token expired');
      }
      if (error instanceof JsonWebTokenError) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      this.loggingService.error({
        message: 'Error while refreshing tokens',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorResponse: error.message,
      });
      throw new InternalServerErrorException('Error while refreshing tokens');
    }
  }

  async validateUser(payload: JwtPayload) {
    try {
      return this.usersService.findOne(payload.userId);
    } catch (error) {
      this.loggingService.error({
        message: 'Error while validating user',
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        errorResponse: error.message,
      });
      throw new InternalServerErrorException('Error while validating user');
    }
  }
}
