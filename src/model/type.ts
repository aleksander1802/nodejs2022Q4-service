import { Artist } from 'src/artists/entities/artist.entity';
import { User } from 'src/users/entities/user.entity';

export interface Database {
  users: User[];
  artists: Artist[];
}
