import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class ArtistsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;

    return this.prisma.artist.create({
      data: {
        name,
        grammy,
      },
    });
  }

  async findAll() {
    return this.prisma.artist.findMany();
  }

  async findOne(id: string) {
    const artist = await this.prisma.artist.findUnique({
      where: { id },
    });

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto) {
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
    });

    if (artist) {
      await this.prisma.artist.delete({
        where: { id },
      });
    } else {
      throw new NotFoundException('Artist not found');
    }
  }
}
