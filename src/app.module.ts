import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { TracksModule } from './tracks/tracks.module';

@Module({
  // imports: [UsersModule, TracksModule, ArtistsModule],
  imports: [UsersModule, TracksModule],
})
export class AppModule {}
