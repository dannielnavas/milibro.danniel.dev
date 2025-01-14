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
    console.log(newLibrary);
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

  async update(id: string, changes: Partial<CreateLibraryDto>) {
    const library = await this.libraries
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    if (!library) {
      throw new NotFoundException(`Product ${id} not found`);
    }
    return library;
  }
}
