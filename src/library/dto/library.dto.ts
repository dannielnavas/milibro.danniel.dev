import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateLibraryDto {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsBoolean()
  @IsNotEmpty()
  wishlist: boolean;
  @IsArray()
  books: string[];
}
