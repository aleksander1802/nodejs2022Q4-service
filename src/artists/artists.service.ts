import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';
import { db } from 'src/database/db';

@Injectable()
export class ArtistsService {
  create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;

    const newArtist: Artist = {
      id: uuidv4(),
      name,
      grammy,
    };

    db.artists.push(newArtist);

    return newArtist;
  }

  findAll() {
    return db.artists;
  }

  findOne(id: string) {
    const artist = db.artists.find((art) => art.id === id);

    if (!artist) {
      throw new NotFoundException('Artist not found');
    }

    return artist;
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const { name, grammy } = updateArtistDto;

    const artist = db.artists.find((art) => art.id === id);

    if (artist) {
      const updatedArtist = {
        ...artist,
        name,
        grammy,
      };

      db.artists = db.artists.map((a) => (a.id === id ? updatedArtist : a));

      return updatedArtist;
    } else {
      throw new NotFoundException('Artist not found');
    }
  }

  remove(id: string) {
    const artist = db.artists.find((art) => art.id === id);

    if (artist) {
      db.artists = db.artists.filter((art) => art.id !== id);

      db.tracks = db.tracks.map((t) =>
        t.artistId === id ? { ...t, artistId: null } : t,
      );

      db.albums = db.albums.map((a) =>
        a.artistId === id ? { ...a, artistId: null } : a,
      );

      db.favorites.artists = db.favorites.artists.filter(
        (artistId) => artistId !== id,
      );
    } else {
      throw new NotFoundException('Artist not found');
    }
  }
}
