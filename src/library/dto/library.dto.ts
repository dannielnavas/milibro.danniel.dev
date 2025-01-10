import { IsArray, IsBoolean, IsNotEmpty, IsString } from 'class-validator';

export class CreateLibraryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsBoolean()
  @IsNotEmpty()
  readonly wishlist: boolean;
  @IsArray()
  readonly books: string[];
}
