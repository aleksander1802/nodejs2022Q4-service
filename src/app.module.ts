import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from 'nestjs-prisma';
import { FavsModule } from './favs/favs.module';
import { TracksModule } from './tracks/tracks.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    UsersModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    FavsModule,
    PrismaModule,
  ],
})
export class AppModule {}
