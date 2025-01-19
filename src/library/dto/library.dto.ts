import { IsBoolean, IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class CreateLibraryDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;
  @IsBoolean()
  @IsNotEmpty()
  readonly wishlist: boolean;

  @IsMongoId()
  @IsNotEmpty()
  readonly user: string;
}
