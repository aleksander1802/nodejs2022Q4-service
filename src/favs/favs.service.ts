import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

import { Favorites } from './favorites';
import { Track } from 'src/tracks/entities/track.entity';
import { Album } from 'src/albums/entities/album.entity';
import { Artist } from 'src/artists/entities/artist.entity';

@Injectable()
export class FavsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(): Promise<Favorites> {
    const favorites = await this.prisma.favorites.findUnique({
      where: { id: 'default-favorites-id' },
      include: {
        artists: true,
        albums: true,
        tracks: true,
      },
    });

    const transformedFavorites: Favorites = {
      artists: favorites.artists.map((artist) => this.mapArtistToId(artist)),
      albums: favorites.albums.map((album) => this.mapAlbumToId(album)),
      tracks: favorites.tracks.map((track) => this.mapTrackToId(track)),
    };

    return transformedFavorites;
  }

  createArtist(id: string) {
    return this.addFavorite('artists', id);
  }

  removeArtist(id: string) {
    return this.removeFavorite('artists', id);
  }

  createAlbum(id: string) {
    return this.addFavorite('albums', id);
  }

  removeAlbum(id: string) {
    return this.removeFavorite('albums', id);
  }

  createTrack(id: string) {
    return this.addFavorite('tracks', id);
  }

  removeTrack(id: string) {
    return this.removeFavorite('tracks', id);
  }

  private async addFavorite(
    entityType: 'artists' | 'albums' | 'tracks',
    id: string,
  ) {
    const exists = await this.prisma[entityType].findUnique({ where: { id } });
    if (exists) {
      await this.prisma.favorites.update({
        where: { id: 'default-favorites-id' },
        data: { [entityType]: { connect: { id } } },
      });
      return this.getEntityById(entityType, id);
    } else {
      throw new UnprocessableEntityException(
        `The ${entityType.slice(0, -1)} does not exist`,
      );
    }
  }

  private async removeFavorite(
    entityType: 'artists' | 'albums' | 'tracks',
    id: string,
  ) {
    const exists = await this.prisma[entityType].findUnique({ where: { id } });
    if (exists) {
      await this.prisma.favorites.update({
        where: { id: 'default-favorites-id' },
        data: { [entityType]: { disconnect: { id } } },
      });
    } else {
      throw new NotFoundException(
        `The ${entityType.slice(0, -1)} does not exist`,
      );
    }
  }

  private getEntityById(
    entityType: 'artists' | 'albums' | 'tracks',
    id: string,
  ) {
    switch (entityType) {
      case 'artists':
        return this.prisma.artist.findUnique({ where: { id } });
      case 'albums':
        return this.prisma.album.findUnique({ where: { id } });
      case 'tracks':
        return this.prisma.track.findUnique({ where: { id } });
    }
  }

  private mapArtistToId(artist: Artist): string {
    return artist.id;
  }

  private mapAlbumToId(album: Album): string {
    return album.id;
  }

  private mapTrackToId(track: Track): string {
    return track.id;
  }
}
