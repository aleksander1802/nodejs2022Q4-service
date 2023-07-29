import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { db } from 'src/database/db';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class TracksService {
  create(createTrackDto: CreateTrackDto) {
    const { name, duration, artistId, albumId } = createTrackDto;

    const newTrack = {
      id: uuidv4(),
      name,
      artistId: artistId || null,
      albumId: albumId || null,
      duration,
    };

    db.tracks.push(newTrack);

    return newTrack;
  }

  findAll() {
    return db.tracks;
  }

  findOne(id: string) {
    const currentTrack = db.tracks.find((track) => track.id === id);

    if (currentTrack) {
      return currentTrack;
    } else {
      throw new NotFoundException('Track not found');
    }
  }

  update(id: string, updateTrackDto: UpdateTrackDto) {
    const { name, artistId, albumId, duration } = updateTrackDto;

    const currentTrack = db.tracks.find((track) => track.id === id);

    if (currentTrack) {
      const updateTrack = {
        ...currentTrack,
        name,
        artistId,
        albumId,
        duration,
      };

      db.tracks = db.tracks.map((t) => (t.id === id ? updateTrack : t));

      return updateTrack;
    } else {
      throw new NotFoundException('Track not found');
    }
  }

  remove(id: string) {
    const currentTrack = db.tracks.find((track) => track.id === id);
    if (currentTrack) {
      db.tracks = db.tracks.filter((track) => track.id !== id);
      db.favorites.tracks = db.favorites.tracks.filter(
        (trackId) => trackId !== id,
      );
    } else {
      throw new NotFoundException('Track not found');
    }
  }
}
