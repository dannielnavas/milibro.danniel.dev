import { PartialType } from '@nestjs/mapped-types';
import {
  IsBoolean,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsString,
  Length,
  MaxLength,
  MinLength,
} from 'class-validator';

export class CreateBooksDto {
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
  readonly lenguaje: string;
  @IsString()
  @IsNotEmpty()
  readonly image_url: string;
  @IsBoolean()
  @IsNotEmpty()
  readonly wishlist: boolean;
  @IsMongoId()
  @IsNotEmpty()
  readonly library: string;
  @IsString()
  startDate: string;
  @IsString()
  endDate: string;
  @IsString()
  status: string;
  @IsString()
  genre: string;
  @IsString()
  totalPages: number;
  @IsString()
  description: string;
}

export class UpdateBooksDto extends PartialType(CreateBooksDto) {}
