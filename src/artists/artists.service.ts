import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { Artist } from './entities/artist.entity';
import { v4 as uuidv4 } from 'uuid';
import { isBoolean, isString } from 'class-validator';

@Injectable()
export class ArtistsService {
  private artists: Artist[] = [];

  create(createArtistDto: CreateArtistDto) {
    const { name, grammy } = createArtistDto;

    if (!name || !grammy) {
      throw new BadRequestException('Name and grammy are required fields');
    }

    const newArtist: Artist = {
      id: uuidv4(),
      name,
      grammy,
    };
    return newArtist;
  }

  findAll() {
    return this.artists;
  }

  findOne(id: string) {
    const artist = this.artists.find((art) => art.id === id);

    if (artist) {
      return artist;
    } else {
      throw new NotFoundException('Artist not found');
    }
  }

  update(id: string, updateArtistDto: UpdateArtistDto) {
    const { newName, newGrammy } = updateArtistDto;

    if (!isString(newName) || !isBoolean(newGrammy)) {
      throw new BadRequestException('Invalid dto');
    }

    const artist = this.artists.find((art) => art.id === id);

    if (artist) {
      artist.name = newName;

      return artist;
    } else {
      throw new NotFoundException('Artist not found');
    }
  }

  remove(id: string) {
    const artist = this.artists.find((art) => art.id === id);

    if (artist) {
      this.artists = this.artists.filter((art) => art.id !== id);
    } else {
      throw new NotFoundException('Artist not found');
    }
  }
}
