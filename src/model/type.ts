import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';
import { Track } from 'src/tracks/entities/track.entity';
import { User } from 'src/users/entities/user.entity';

export interface Database {
  users: User[];
  artists: Artist[];
  tracks: Track[];
  albums: Album[];
  favorites: Favorites;
}

export interface Favorites {
  artists: string[];
  albums: string[];
  tracks: string[];
}
