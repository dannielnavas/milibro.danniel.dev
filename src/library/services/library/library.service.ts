import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateLibraryDto } from 'src/library/dto/library.dto';
import { Library } from 'src/library/entities/library.entity';
import { UsersService } from 'src/users/services/users/users.service';

@Injectable()
export class LibraryService {
  constructor(
    @InjectModel(Library.name) private readonly libraries: Model<Library>,
    private readonly usersService: UsersService,
  ) {}

  async create(data: CreateLibraryDto, id: string) {
    const newLibrary = new this.libraries(data);
    this.usersService.update(id, newLibrary._id as string);
    return newLibrary.save();
  }

  async findOneById(id: string) {
    const library = await this.libraries.findById(id);
    if (!library) {
      throw new NotFoundException(`Library ${id} not found`);
    }
    return library;
  }

  async update(id: string, changes: string) {
    const libraryData = await this.findOneById(id);
    console.log(libraryData);
    if (!libraryData) {
      throw new NotFoundException(`User #${id} not found`);
    }
    const updateBooks = {
      ...libraryData.toObject(),
      books: libraryData.books || [],
    };
    console.log(updateBooks);
    updateBooks.books.push(changes);
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
