import { ApiProperty } from '@nestjs/swagger';

export class RefreshDto {
  @ApiProperty({
    required: true,
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZGFkZjFlNC1kZjM4LTQzZjYtOGI2ZC03MGZjYjRkZjFmMjAiLCJsb2dpbiI6ImFkbWluMjIiLCJpYXQiOjE2OTI1NjkxNjAsImV4cCI6MTY5MjU3Mjc2MH0.f7uUY8phsZv4fudS4fYZty0hXHZJVGwHY0T-qFEgS8A',
    description: 'Token',
  })
  refreshToken: string;
}
