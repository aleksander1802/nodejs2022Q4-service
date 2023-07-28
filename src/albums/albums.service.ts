import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { db } from 'src/database/db';
import { v4 as uuidv4 } from 'uuid';
import { isInt, isString, isUUID } from 'class-validator';

@Injectable()
export class AlbumsService {
  create(createAlbumDto: CreateAlbumDto) {
    const { artistId, name, year } = createAlbumDto;

    if (!name || !year) {
      throw new BadRequestException('Name and year are required fields');
    }

    const newAlbum = {
      id: uuidv4(),
      name,
      year,
      artistId: artistId || null,
    };

    db.albums.push(newAlbum);

    return newAlbum;
  }

  findAll() {
    return db.albums;
  }

  findOne(id: string) {
    const currentAlbum = db.albums.find((album) => album.id === id);

    if (!currentAlbum) {
      throw new NotFoundException('Album not found');
    }

    return currentAlbum;
  }

  update(id: string, updateAlbumDto: UpdateAlbumDto) {
    const { artistId, name, year } = updateAlbumDto;

    if (!isString(name) || !isInt(year)) {
      throw new BadRequestException('Invalid input data');
    }

    if (artistId !== null && !isUUID(artistId)) {
      throw new BadRequestException('Invalid artistId');
    }

    const currentAlbum = db.albums.find((album) => album.id === id);

    if (!currentAlbum) {
      throw new NotFoundException('Album not found');
    }

    const updatedAlbum = {
      ...currentAlbum,
      artistId,
      name,
      year,
    };

    db.albums = db.albums.map((a) =>
      a.id === currentAlbum.id ? updatedAlbum : a,
    );

    return updatedAlbum;
  }

  remove(id: string) {
    const currentAlbum = db.albums.find((album) => album.id === id);

    if (currentAlbum) {
      db.albums = db.albums.filter((album) => album.id !== id);
      db.tracks = db.tracks.map((t) =>
        t.albumId === id ? { ...t, albumId: null } : t,
      );
    } else {
      throw new NotFoundException('Album not found');
    }
  }
}
