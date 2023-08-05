import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'nestjs-prisma';
import { Artist } from './entities/artist.entity';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto): Promise<Artist> {
    const { name, grammy } = createArtistDto;

    return this.prisma.artist.create({
      data: {
        name,
        grammy,
      },
    });
  }

  async findAll(): Promise<Artist[]> {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<Artist> {
    const { name, grammy } = updateArtistDto;

    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (artist) {
      return this.prisma.artist.update({
        where: { id },
        data: {
          name,
          grammy,
        },
      });
    } else {
      throw new NotFoundException('Artist not found');
    }
  }

  async remove(id: string): Promise<void> {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
      include: {
        favorites: true,
      },
    });

    if (artist) {
      await this.prisma.artist.delete({
        where: { id },
      });

      if (artist.favorites && artist.favorites.id) {
        await this.prisma.favorites.update({
          where: { id: artist.favorites.id },
          data: {
            artists: {
              disconnect: { id },
            },
          },
        });
      }

      await this.prisma.track.updateMany({
        where: { artistId: id },
        data: {
          artistId: null,
        },
      });

      await this.prisma.album.updateMany({
        where: { artistId: id },
        data: {
          artistId: null,
        },
      });
    } else {
      throw new NotFoundException('Artist not found');
    }
  }
}
