import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'nestjs-prisma';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto) {
    const { name, duration, artistId, albumId } = createTrackDto;

    return this.prisma.track.create({
      data: {
        name,
        duration,
        artistId: artistId || null,
        albumId: albumId || null,
      },
    });
  }

  async findAll() {
    return this.prisma.track.findMany();
  }

  async findOne(id: string) {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (track) {
      return track;
    } else {
      throw new NotFoundException('Track not found');
    }
  }

  async update(id: string, updateTrackDto: UpdateTrackDto) {
    const { name, artistId, albumId, duration } = updateTrackDto;

    const currentTrack = await this.prisma.track.findUnique({
      where: { id },
    });

    if (currentTrack) {
      return this.prisma.track.update({
        where: { id },
        data: {
          name,
          artistId: artistId || null,
          albumId: albumId || null,
          duration,
        },
      });
    } else {
      throw new NotFoundException('Track not found');
    }
  }

  async remove(id: string): Promise<void> {
    const currentTrack = await this.prisma.track.findUnique({
      where: { id },
    });

    if (currentTrack) {
      await this.prisma.track.delete({
        where: { id },
      });
    } else {
      throw new NotFoundException('Track not found');
    }
  }
}
