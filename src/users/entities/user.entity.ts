import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

export class User {
  @ApiProperty({ required: true, format: 'uuid' })
  id: string;

  @ApiProperty({ required: true, example: 'TestUser' })
  login: string;

  @ApiProperty({
    required: true,
    description: 'user password',
    example: 'testPassword',
  })
  @Exclude()
  password: string;

  @ApiPropertyOptional({
    required: false,
  })
  token: string;

  version: number;

  @ApiPropertyOptional({
    required: false,
    example: 1655000000,
  })
  createdAt: number;

  @ApiPropertyOptional({
    required: false,
    example: 1655000000,
  })
  updatedAt: number;
}
