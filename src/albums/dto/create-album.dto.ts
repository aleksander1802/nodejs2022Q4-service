import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAlbumDto {
  @ApiProperty({ example: 'Innuendo' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 1991 })
  @IsInt()
  year: number;

  @ApiPropertyOptional({ format: 'uuid', nullable: true })
  @IsOptional()
  artistId: string | null;
}
