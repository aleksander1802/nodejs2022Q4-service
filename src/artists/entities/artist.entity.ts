import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class Artist {
  @ApiProperty({ required: true, format: 'uuid' })
  id: string;

  @ApiProperty({ required: true, example: 'Freddie Mercury' })
  name: string;

  @ApiPropertyOptional({ required: false, example: false })
  grammy: boolean;
}
