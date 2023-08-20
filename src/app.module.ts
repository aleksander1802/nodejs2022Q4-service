import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { PrismaModule } from 'nestjs-prisma';
import { FavsModule } from './favs/favs.module';
import { TracksModule } from './tracks/tracks.module';
import { UsersModule } from './users/users.module';
import { ArtistsModule } from './artists/artists.module';
import { AlbumsModule } from './albums/albums.module';
import { AuthModule } from './auth/auth.module';
import { LoggerMiddleware } from './logger/logger.middleware';
import { LoggingService } from './logger/logging.service';
import { AllExceptionsFilter } from './filter/exception.filter';
import { APP_FILTER } from '@nestjs/core';

@Module({
  imports: [
    UsersModule,
    TracksModule,
    ArtistsModule,
    AlbumsModule,
    FavsModule,
    PrismaModule,
    AuthModule,
  ],
  providers: [
    LoggingService,
    AllExceptionsFilter,
    {
      provide: APP_FILTER,
      useValue: new AllExceptionsFilter(new LoggingService()),
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
