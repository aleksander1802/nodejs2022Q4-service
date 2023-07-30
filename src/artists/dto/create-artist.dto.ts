import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsBoolean, IsNotEmpty } from 'class-validator';

export class CreateArtistDto {
  @ApiProperty({ required: true, example: 'Freddie Mercury' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true, example: false })
  @IsNotEmpty()
  @IsBoolean()
  grammy: boolean;
}
