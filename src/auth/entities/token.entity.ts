import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class Token {
  @ApiProperty({
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZGFkZjFlNC1kZjM4LTQzZjYtOGI2ZC03MGZjYjRkZjFmMjAiLCJsb2dpbiI6ImFkbWluMjIiLCJpYXQiOjE2OTI1NjkyNDIsImV4cCI6MTY5MjU3Mjg0Mn0.lSWG5N0s8jHxirY_2CJ6x3u7vcIYaPS1Im3VQvvmAKc',
    description: 'Access token',
  })
  @IsNotEmpty()
  @IsString()
  accessToken: string;
  @ApiProperty({
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZGFkZjFlNC1kZjM4LTQzZjYtOGI2ZC03MGZjYjRkZjFmMjAiLCJsb2dpbiI6ImFkbWluMjIiLCJpYXQiOjE2OTI1NjkyNDIsImV4cCI6MTY5MjY1NTY0Mn0.aTlWklOFdNaBmCjzU2YFEAcw79rGKC6fWylcMURbSH8',
    description: 'Refresh token',
  })
  @IsNotEmpty()
  @IsString()
  refreshToken: string;
}
