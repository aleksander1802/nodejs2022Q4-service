import { IsString, IsNotEmpty } from 'class-validator';

export class SignupDto {
  @IsNotEmpty()
  @IsString()
  login: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
