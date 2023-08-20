import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
    example: 'TestUser',
    description: 'User login',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    required: true,
    example: 'TestPassword',
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
