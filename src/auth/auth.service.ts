import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtPayload } from './jwt.inteface';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signupDto: SignupDto) {
    const hashedPassword = await bcrypt.hash(signupDto.password, 10);
    const user = await this.usersService.create({
      ...signupDto,
      password: hashedPassword,
    });
    return user;
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findOneByLogin(loginDto.login);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = { userId: user.id, login: user.login };
    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });
    const refreshToken = await this.jwtService.signAsync(payload, {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });

    return { accessToken, refreshToken };
  }

  async refreshTokens(refreshToken: string) {
    const decoded = await this.jwtService.verify(refreshToken);

    const user = await this.usersService.findOne(decoded.userId);

    if (!user) {
      throw new UnauthorizedException();
    }

    const payload: JwtPayload = { userId: user.id, login: user.login };
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.TOKEN_EXPIRE_TIME,
    });
    const newRefreshToken = this.jwtService.sign(payload, {
      expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
    });

    return { accessToken, refreshToken: newRefreshToken };
  }

  async validateUser(payload: JwtPayload) {
    return this.usersService.findOne(payload.userId);
  }
}
