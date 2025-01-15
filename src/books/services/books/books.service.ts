import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateBooksDto } from 'src/books/dto/books.dto';
import { Books } from 'src/books/entities/books.entity';
import { LibraryService } from '../../../library/services/library/library.service';

@Injectable()
export class BooksService {
  constructor(
    @InjectModel(Books.name) private readonly books: Model<Books>,
    private readonly libraryService: LibraryService,
  ) {}

  async create(data: CreateBooksDto, idLibrary: string) {
    const newBooks = new this.books(data);
    this.libraryService.update(idLibrary, newBooks._id as string);
    return newBooks.save();
  }

  async findOneById(id: string) {
    const books = await this.books.findById(id);
    return books;
  }

  async update(id: string, changes: any) {
    const books = this.books
      .findByIdAndUpdate(id, { $set: changes }, { new: true })
      .exec();
    return books;
  }
}
