import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Old password',
  })
  @IsNotEmpty()
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'New  password',
  })
  @IsNotEmpty()
  @IsString()
  newPassword: string;
}
