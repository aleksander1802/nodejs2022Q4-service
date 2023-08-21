import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshDto } from './dto/refresh.dto';
import { Public } from './public.decorator';
import {
  ApiBadRequestResponse,
  ApiForbiddenResponse,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Token } from './entities/token.entity';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('signup')
  @ApiOperation({
    summary: 'Signup',
    description: 'Signup and return user',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Successful signup.',
  })
  @ApiBadRequestResponse({
    description: 'No login or password, or they are not a strings',
  })
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() signupDto: SignupDto) {
    return await this.authService.signUp(signupDto);
  }

  @Public()
  @Post('login')
  @ApiOperation({
    summary: 'Login',
    description: 'Login and return access and refresh tokens',
  })
  @ApiResponse({ status: HttpStatus.OK, description: 'Successful login.' })
  @ApiBadRequestResponse({
    description: 'No login or password, or they are not a strings',
  })
  @ApiForbiddenResponse({
    description: "No user with such login, password doesn't match actual one",
  })
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto) {
    try {
      return this.authService.login(loginDto);
    } catch (error) {
      if (error.status === HttpStatus.FORBIDDEN) {
        throw new ForbiddenException('Authentication failed');
      }
      throw error;
    }
  }

  @Post('refresh')
  @ApiOperation({
    summary: 'Refresh token',
    description: 'Refresh and return access and refresh tokens',
  })
  @ApiOkResponse({
    description: 'Successful refresh.',
    type: Token,
  })
  @ApiUnauthorizedResponse({
    description: 'No refreshToken in body ',
  })
  @ApiForbiddenResponse({ description: 'Refresh token is invalid or expired' })
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshDto: RefreshDto) {
    return await this.authService.refreshTokens(refreshDto);
  }
}
