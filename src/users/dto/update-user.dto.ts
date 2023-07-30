import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    required: true,
    description: 'Old password',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    required: true,
    description: 'New  password',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
