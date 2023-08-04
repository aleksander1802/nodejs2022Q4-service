import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'nestjs-prisma';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { Album } from '.prisma/client';

@Injectable()
export class AlbumsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const { artistId, name, year } = createAlbumDto;

    return this.prisma.album.create({
      data: {
        name,
        year,
        artistId: artistId || null,
      },
    });
  }

  async findAll(): Promise<Album[]> {
    return this.prisma.album.findMany();
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!album) {
      throw new NotFoundException('Album not found');
    }

    return album;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const { artistId, name, year } = updateAlbumDto;

    const currentAlbum = await this.prisma.album.findUnique({
      where: { id },
    });

    if (!currentAlbum) {
      throw new NotFoundException('Album not found');
    }

    return this.prisma.album.update({
      where: { id },
      data: {
        artistId,
        name,
        year,
      },
    });
  }

  async remove(id: string): Promise<void> {
    const currentAlbum = await this.prisma.album.findUnique({
      where: { id },
    });

    if (currentAlbum) {
      await this.prisma.album.delete({
        where: { id },
      });

      await this.prisma.track.updateMany({
        where: { albumId: id },
        data: { albumId: null },
      });

      await this.prisma.favorites.update({
        where: { id: currentAlbum.favoritesId },
        data: {
          albums: {
            disconnect: {
              id,
            },
          },
        },
      });
    } else {
      throw new NotFoundException('Album not found');
    }
  }
}
