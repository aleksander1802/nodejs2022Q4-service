import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { FavsModule } from './favs/favs.module';

@Module({
  imports: [UsersModule, TracksModule, ArtistsModule, AlbumsModule, FavsModule],
})
export class AppModule {}
