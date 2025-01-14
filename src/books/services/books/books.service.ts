import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Books } from 'src/books/entities/books.entity';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Books.name) private readonly books: Model<Books>) {}

  async create(data: any) {
    const newBooks = new this.books(data);
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
