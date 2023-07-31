import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Album {
  @ApiProperty({ required: true, format: 'uuid' })
  id: string;

  @ApiProperty({ required: true, example: 'Innuendo' })
  name: string;

  @ApiProperty({ required: true, example: 1991 })
  year: number;

  @ApiPropertyOptional({ required: false, format: 'uuid', nullable: true })
  artistId: string | null;
}
