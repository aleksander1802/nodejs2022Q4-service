import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ required: true, example: 'Innuendo' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ required: true, example: 1991 })
  @IsInt()
  year: number;

  @ApiPropertyOptional({ required: false, format: 'uuid', nullable: true })
  @IsOptional()
  artistId: string | null;
}
