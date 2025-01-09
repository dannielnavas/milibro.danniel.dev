import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';
import { ERoles } from 'src/auth/models/roles.model';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  @Length(6)
  readonly password: string;

  @IsNotEmpty()
  readonly role: ERoles;

  @IsNotEmpty()
  @IsString()
  readonly name: string;
}
