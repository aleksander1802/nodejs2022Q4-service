import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Track {
  @ApiProperty({ required: true, format: 'uuid' })
  id: string;

  @ApiProperty({ required: true, example: 'The Show Must Go On' })
  name: string;

  @ApiPropertyOptional({ required: false, format: 'uuid', nullable: true })
  artistId: string | null;

  @ApiPropertyOptional({ required: false, format: 'uuid', nullable: true })
  albumId: string | null;

  @ApiProperty({ required: true, description: 'In seconds', example: 262 })
  duration: number;
}
