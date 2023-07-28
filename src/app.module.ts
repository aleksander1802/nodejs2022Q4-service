import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';
import { ArtistsModule } from './artists/artists.module';

@Module({
  imports: [UsersModule, TracksModule, ArtistsModule],
})
export class AppModule {}
