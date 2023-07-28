import { IsBoolean, IsString } from 'class-validator';

export class UpdateArtistDto {
  @IsString()
  newName: string;

  @IsBoolean()
  newGrammy: boolean;
}
