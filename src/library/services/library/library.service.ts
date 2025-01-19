import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLibraryDto } from 'src/library/dto/library.dto';
import { Library } from 'src/library/entities/library.entity';

@Injectable()
export class LibraryService {
  constructor(
    @InjectModel(Library.name) private readonly libraries: Model<Library>,
  ) {}

  async create(data: CreateLibraryDto) {
    const newLibrary = new this.libraries(data);
    return newLibrary.save();
  }

  async findOneById(id: string) {
    const library = await this.libraries.findById(id);
    if (!library) {
      throw new NotFoundException(`Library ${id} not found`);
    }
    return library;
  }

  async findOneByIdUserAndWishlist(idUser: string, wishlist: boolean) {
    console.log(idUser, wishlist);
    const library = await this.libraries.findOne({
      user: idUser,
      wishlist,
    });
    console.log(library);
    if (!library) {
      throw new NotFoundException(`Library ${idUser} not found`);
    }
    return library;
  }

  async update(id: string) {
    const libraryData = await this.findOneById(id);
    console.log(libraryData);
    if (!libraryData) {
      throw new NotFoundException(`User #${id} not found`);
    }
    const updateBooks = {
      ...libraryData.toObject(),
    };
    console.log(updateBooks);
    console.log(updateBooks);
    const library = await this.libraries
      .findByIdAndUpdate(id, { $set: updateBooks }, { new: true })
      .exec();
    if (!library) {
      throw new NotFoundException(`Library #${id} not found`);
    }
    return library;
  }
}
