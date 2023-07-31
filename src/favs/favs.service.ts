import {
  Inject,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { AlbumsService } from 'src/albums/albums.service';
import { ArtistsService } from 'src/artists/artists.service';
import { TracksService } from 'src/tracks/tracks.service';
import { db } from 'src/database/db';

@Injectable()
export class FavsService {
  @Inject(ArtistsService)
  private artistsService: ArtistsService;
  @Inject(AlbumsService)
  private albumsService: AlbumsService;
  @Inject(TracksService)
  private tracksService: TracksService;

  findAll() {
    const artists = db.favorites.artists.map((artist) =>
      this.artistsService.findOne(artist),
    );

    const albums = db.favorites.albums.map((album) =>
      this.albumsService.findOne(album),
    );

    const tracks = db.favorites.tracks.map((track) =>
      this.tracksService.findOne(track),
    );

    return { artists, albums, tracks };
  }

  createArtist(id: string) {
    const currentArtist = db.artists.find((artist) => artist.id === id);

    if (currentArtist) {
      db.favorites.artists.push(id);

      return currentArtist;
    } else {
      throw new UnprocessableEntityException('The artist does not exist');
    }
  }

  removeArtist(id: string) {
    const favoriteArtist = db.artists.find((artist) => artist.id === id);

    if (favoriteArtist) {
      db.favorites.artists = db.favorites.artists.filter(
        (artistId) => artistId !== id,
      );
    } else {
      throw new NotFoundException('The artist does not exist');
    }
  }

  createAlbum(id: string) {
    const currentAlbum = db.albums.find((album) => album.id === id);

    if (currentAlbum) {
      db.favorites.albums.push(id);

      return currentAlbum;
    } else {
      throw new UnprocessableEntityException('The album does not exist');
    }
  }

  removeAlbum(id: string) {
    const favoriteAlbum = db.albums.find((album) => album.id === id);

    if (favoriteAlbum) {
      db.favorites.albums = db.favorites.albums.filter(
        (albumId) => albumId !== id,
      );
    } else {
      throw new NotFoundException('The album does not exist');
    }
  }

  createTrack(id: string) {
    const currentTrack = db.tracks.find((track) => track.id === id);

    if (currentTrack) {
      db.favorites.tracks.push(id);

      return currentTrack;
    } else {
      throw new UnprocessableEntityException('The track does not exist');
    }
  }

  removeTrack(id: string) {
    const favoriteTrack = db.tracks.find((track) => track.id === id);

    if (favoriteTrack) {
      db.favorites.tracks = db.favorites.tracks.filter(
        (trackId) => trackId !== id,
      );
    } else {
      throw new NotFoundException('The track does not exist');
    }
  }
}
