import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTrackDto {
  @ApiProperty({ required: true, example: 'The Show Must Go On' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiPropertyOptional({ required: false, format: 'uuid', nullable: true })
  @IsOptional()
  artistId: string | null;

  @ApiPropertyOptional({ required: false, format: 'uuid', nullable: true })
  @IsOptional()
  albumId: string | null;

  @ApiProperty({ required: true, description: 'In seconds', example: 262 })
  @IsNotEmpty()
  @IsInt()
  duration: number;
}
