import { Module } from '@nestjs/common';
import { BooksService } from './services/books/books.service';
import { BooksController } from './controllers/books/books.controller';

@Module({
  providers: [BooksService],
  controllers: [BooksController]
})
export class BooksModule {}
