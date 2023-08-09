import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'nestjs-prisma';
import { Album } from '@prisma/client';

@Injectable()
export class AlbumsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAlbumDto: CreateAlbumDto): Promise<Album> {
    const { artistId, name, year } = createAlbumDto;

    return this.prisma.album.create({
      data: {
        artistId: artistId || null,
        name,
        year,
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

    if (album) {
      return album;
    } else {
      throw new NotFoundException('Album not found');
    }
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<Album> {
    const { artistId, name, year } = updateAlbumDto;

    const currentAlbum = await this.prisma.album.findUnique({
      where: { id },
    });

    if (currentAlbum) {
      return this.prisma.album.update({
        where: { id },
        data: {
          artistId: artistId || null,
          name,
          year,
        },
      });
    } else {
      throw new NotFoundException('Album not found');
    }
  }

  async remove(id: string): Promise<void> {
    const currentAlbum = await this.prisma.album.findUnique({
      where: { id },
    });

    if (currentAlbum) {
      await this.prisma.album.delete({
        where: { id },
      });
    } else {
      throw new NotFoundException('Album not found');
    }
  }
}
