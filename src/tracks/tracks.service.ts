import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { PrismaService } from 'nestjs-prisma';
import { Track } from '@prisma/client';

@Injectable()
export class TracksService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createTrackDto: CreateTrackDto): Promise<Track> {
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

  async findAll(): Promise<Track[]> {
    return this.prisma.track.findMany();
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({
      where: { id },
    });

    if (track) {
      return track;
    } else {
      throw new NotFoundException('Track not found');
    }
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<Track> {
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
