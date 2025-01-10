import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class BooksDto {
  @IsString()
  @IsNotEmpty()
  readonly title: string;
  @IsString()
  @IsNotEmpty()
  readonly author: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(10)
  @MaxLength(13)
  readonly isbn: string;
  @IsNumber()
  @IsNotEmpty()
  @Length(4, 4)
  readonly publication_year: number;
  @IsString()
  @IsNotEmpty()
  readonly publisher: string;
  @IsString()
  @IsNotEmpty()
  readonly image_url: string;
  @IsBoolean()
  @IsNotEmpty()
  readonly wishlist: boolean;
}
