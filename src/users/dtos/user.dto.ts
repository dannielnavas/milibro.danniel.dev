import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ERoles } from '../../auth/models/roles.model';

export class CreateUserDto {
  @IsString()
  @IsEmail()
  readonly email: string;

  @IsString()
  @IsNotEmpty()
  readonly password: string;

  @IsNotEmpty()
  readonly role: ERoles;

  @IsNotEmpty()
  @IsString()
  readonly name: string;
}

export class UserDto {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: ERoles;
  createdAt?: Date;
  updatedAt?: Date;
}
