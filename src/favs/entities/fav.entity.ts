import { ApiProperty } from '@nestjs/swagger';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';

export class Fav {
  @ApiProperty({ type: () => [Artist] })
  artists: Artist[];

  @ApiProperty({ type: () => [Album] })
  albums: Album[];

  @ApiProperty({ type: () => [Track] })
  tracks: Track[];
}
