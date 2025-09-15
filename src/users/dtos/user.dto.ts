import { PartialType } from '@nestjs/mapped-types';
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

  @IsNotEmpty()
  @IsString()
  readonly image: string;
}

export class UpdateUserDto extends PartialType(CreateUserDto) {}

export class UserDto {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: ERoles;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}
