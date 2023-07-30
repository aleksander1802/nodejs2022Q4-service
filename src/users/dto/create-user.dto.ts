import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User login',
  })
  @IsNotEmpty()
  @IsString()
  login: string;

  @ApiProperty({
    description: 'User password',
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
