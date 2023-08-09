import {
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class FavsService {
  constructor(private readonly prisma: PrismaService) {}

  async findOrCreateFavorites() {
    let favorites = await this.prisma.favorites.findFirst();

    if (!favorites) {
      favorites = await this.prisma.favorites.create({ data: {} });
    }

    return favorites;
  }

  async findAll() {
    await this.findOrCreateFavorites();

    return await this.prisma.favorites.findFirst({
      include: {
        tracks: {
          select: {
            id: true,
            name: true,
            duration: true,
            artistId: true,
            albumId: true,
          },
        },
        artists: {
          select: {
            id: true,
            name: true,
            grammy: true,
          },
        },
        albums: {
          select: {
            id: true,
            name: true,
            year: true,
            artistId: true,
          },
        },
      },
    });
  }

  async createArtist(id: string) {
    const currentArtist = await this.prisma.artist.findUnique({
      where: { id },
    });

    const favorites = await this.findOrCreateFavorites();

    if (currentArtist) {
      await this.prisma.artist.update({
        where: { id },
        data: { favoritesId: favorites.id },
      });

      return currentArtist;
    } else {
      throw new UnprocessableEntityException('The artist does not exist');
    }
  }

  async removeArtist(id: string) {
    const artistInFavorites = await this.prisma.artist.findFirst({
      where: { id },
    });

    if (artistInFavorites) {
      await this.prisma.artist.update({
        where: { id },
        data: { favoritesId: null },
      });
    } else {
      throw new NotFoundException('The artist does not exist in favorites');
    }
  }

  async createAlbum(id: string) {
    const currentAlbum = await this.prisma.album.findUnique({ where: { id } });

    const favorites = await this.findOrCreateFavorites();

    if (currentAlbum) {
      await this.prisma.album.update({
        where: { id },
        data: { favoritesId: favorites.id },
      });

      return currentAlbum;
    } else {
      throw new UnprocessableEntityException('The album does not exist');
    }
  }

  async removeAlbum(id: string) {
    const albumInFavorites = await this.prisma.album.findFirst({
      where: { id },
    });

    if (albumInFavorites) {
      await this.prisma.album.update({
        where: { id },
        data: { favoritesId: null },
      });
    } else {
      throw new NotFoundException('The album does not exist in favorites');
    }
  }

  async createTrack(id: string) {
    const currentTrack = await this.prisma.track.findUnique({ where: { id } });

    const favorites = await this.findOrCreateFavorites();

    if (currentTrack) {
      await this.prisma.track.update({
        where: { id },
        data: { favoritesId: favorites.id },
      });

      return currentTrack;
    } else {
      throw new UnprocessableEntityException('The track does not exist');
    }
  }

  async removeTrack(id: string) {
    const trackInFavorites = await this.prisma.track.findFirst({
      where: { id },
    });

    if (trackInFavorites) {
      await this.prisma.track.update({
        where: { id },
        data: { favoritesId: null },
      });
    } else {
      throw new NotFoundException('The track does not exist in favorites');
    }
  }
}
