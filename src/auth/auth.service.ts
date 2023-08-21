import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt.inteface';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signupDto: SignupDto) {
    return await this.usersService.create(signupDto);
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByLogin(loginDto.login);

    if (!user) {
      throw new ForbiddenException('Authentication failed');
    }

    const passwordMatch = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!passwordMatch) {
      throw new ForbiddenException('Authentication failed');
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
  }

  async refreshTokens(refreshToken: RefreshDto) {
    if (!refreshToken.refreshToken) {
      throw new UnauthorizedException('Body should contain refreshToken');
    }

    try {
      const decoded = this.jwtService.verify(refreshToken.refreshToken);
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
      throw new ForbiddenException('Invalid refresh token');
    }
  }

  async validateUser(payload: JwtPayload) {
    return this.usersService.findOne(payload.userId);
  }
}
